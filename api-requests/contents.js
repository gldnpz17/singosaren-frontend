import { gql } from "@apollo/client"
import { DateTime } from "luxon"
import { gqlClient } from "../common/gqlClient"
import { mapContentSimple } from "../common/mapper/contents"
import { mapTagsSimple } from "../common/mapper/tags"

const fetchAllContentsQuery = gql`
  query FetchAllContents {
    contents {
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

async function fetchAllContents() {
  const { data } = await gqlClient.query({ query: fetchAllContentsQuery })

  return data.contents.data.map(mapContentSimple)
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

const fetchTagContentsQuery = gql`
  query FetchTagContents($tagId: ID) {
    tag(id: $tagId) {
      data {
        attributes {
          name
          description
          contents {
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
      }
    }
  }
`

async function fetchTagContents(tagId) {
  const { data } = await gqlClient.query({ query: fetchTagContentsQuery, variables: { tagId } }) 

  return ({
    tag: {
      name: data.tag.data.attributes.name,
      description: data.tag.data.attributes.description
    },
    contents: data.tag.data.attributes.contents.data.map(mapContentSimple)
  })
}

export { fetchAllContents, fetchContentIdentifiers, fetchContentById, fetchTagContents }