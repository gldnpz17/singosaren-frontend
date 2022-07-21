import { gql } from "@apollo/client"
import { DateTime } from "luxon"
import { gqlClient } from "../common/gqlClient"
import { mapContentSimple } from "../common/mapper/contents"
import { mapTagsSimple } from "../common/mapper/tags"
import { SeedableRandom } from '../common/SeedableRandom'

const defaultOptions = {
  tagId: null,
  keywords: null
}

async function fetchContents(page=1, options) {
  const { tagId, keywords } = { ...defaultOptions, ...options }

  const strPageSize = process.env.NEXT_PUBLIC_PAGINATION_PAGE_SIZE

  let pageSize = strPageSize ? Number.parseInt(strPageSize) : 12

  const filterParams = []
  const filters = []
  if (tagId) {
    filterParams.push('$tagId: ID')
    filters.push('{ tags: { id: { eq: $tagId } } }')
  }
  if (keywords) {
    filterParams.push('$keywords: String')
    filters.push('{ or: [{ title: { containsi: $keywords } }, { body: { containsi: $keywords } }] }')
  }

  const filterParamsString = filterParams.length > 0 ? `, ${filterParams.join(', ')}` : ''
  const filtersString = filters.length > 0 ? `, filters: { and: [ ${filters.join(', ')} ] }` : ''

  const query = gql`
    query FetchContents($page: Int, $pageSize: Int${filterParamsString}) {
      contents(pagination: { page: $page, pageSize: $pageSize }, sort: "publishedAt:desc"${filtersString}) {
        meta {
          pagination {
            pageCount
            page
          }
        }
        data {
          id
          attributes {
            title
            author
            shortDescription
            publishedAt
            coverImage {
              data {
                attributes {
                  url
                }
              }
            }
            tags {
              data {
                id
                attributes {
                  name
                }
              }
            }
          }
        }
      }
    }
  `

  const { data } = await gqlClient.query({ query, variables: { page, pageSize, tagId, keywords }, fetchPolicy: 'no-cache' })

  return ({
    meta: data.contents.meta,
    contents: data.contents.data.map(mapContentSimple)
  })
}

const fetchContentByIdQuery = gql`
  query FetchContentById($id: ID) {
    content(id: $id) {
      data {
        attributes {
          title
          author
          shortDescription
          publishedAt
          coverImage {
            data {
              attributes {
                url
              }
            }
          }
          tags {
            data {
              id
              attributes {
                name
              }
            }
          }
          body
        }
      }
    }
  }
`

async function fetchContentById(id) {
  const { data } = await gqlClient.query({ query: fetchContentByIdQuery, variables: { id }, fetchPolicy: 'no-cache' })

  const { attributes } = data.content.data

  return ({
    id,
    coverImageUrl: attributes.coverImage.data.attributes.url,
    shortDescription: attributes.shortDescription,
    title: attributes.title,
    author: attributes.author,
    publicationTime: DateTime.fromISO(attributes.publishedAt).toLocaleString(DateTime.DATE_MED),
    tags: mapTagsSimple(attributes.tags.data),
    body: attributes.body
  })
}

const fetchContentIdentifiersQuery = gql`
  query fetchAllContentIdentifiers {
    contents {
      data {
        id
        attributes {
          title
        }
      }
    }
  }
`

async function fetchContentIdentifiers() {
  const { data } = await gqlClient.query({ query: fetchContentIdentifiersQuery, fetchPolicy: 'no-cache' })

  return data.contents.data
}

const fetchContentCountQuery = gql`
  query FetchContentCount {
    contents {
      meta {
        pagination {
          total
        }
      }	
    }
  }
`

async function fetchContentCount() {
  const { data } = await gqlClient.query({ query: fetchContentCountQuery, fetchPolicy: 'no-cache' })

  return data.contents.meta.pagination.total
}

async function fetchSimpleContentById(id) {
  const query = gql`
    query FetchSimpleContentById($id: ID) {
      content(id: $id) {
        data {
          id
          attributes {
            title
            author
            shortDescription
            publishedAt
            coverImage {
              data {
                attributes {
                  url
                }
              }
            }
            tags {
              data {
                id
                attributes {
                  name
                }
              }
            }
          }
        }
      }
    }
  `

  const { data } = await gqlClient.query({ query: query, fetchPolicy: 'no-cache', variables: { id } })

  return mapContentSimple(data.content.data)
}

async function fetchRandomContents(amount, seed) {
  
  const totalArticles = await fetchContentCount()
  const contents = []
  const random = new SeedableRandom({ min: 0, max: totalArticles, seed })

  while (contents.length < amount) {
    try {
      const id = random.getRandomInt()
      console.log("id", id)
      const content = await fetchSimpleContentById(id)
      
      if (content) contents.push(content)
    } catch(e) {
      console.log(`Error attempting to fetch article with the ID of ${id} to use for random articles.`)
    }
  }

  return contents
}

export { 
  fetchContents, 
  fetchContentIdentifiers, 
  fetchContentById, 
  fetchContentCount, 
  fetchRandomContents 
}