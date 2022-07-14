import { gql } from "@apollo/client"
import { DateTime } from "luxon"
import { gqlClient } from "../common/gqlClient"
import { mapContentSimple } from "../common/mapper/contents"
import { mapTagsSimple } from "../common/mapper/tags"

const defaultOptions = {
  tagId: null,
  keywords: null
}

async function fetchContents(page=1, options) {
  const { tagId, keywords } = { ...defaultOptions, ...options }

  let pageSize = 12
  try {
    pageSize = Number.parseInt(process.env.NEXT_PUBLIC_PAGINATION_PAGE_SIZE)
  } catch { console.log('Page size not set. Using the default value (12).') }

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

  const { data } = await gqlClient.query({ query, variables: { page, pageSize, tagId, keywords } })

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
  const { data } = await gqlClient.query({ query: fetchContentByIdQuery, variables: { id } })

  const { attributes } = data.content.data

  return ({
    id,
    coverImageUrl: attributes.coverImage.data.attributes.url,
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
  const { data } = await gqlClient.query({ query: fetchContentIdentifiersQuery })

  return data.contents.data
}

export { fetchContents, fetchContentIdentifiers, fetchContentById }