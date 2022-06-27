import { gql } from "@apollo/client"
import { gqlClient } from "../common/gqlClient"
import { mapTagsSimple } from "../common/mapper/tags"


const fetchAllTagsQuery = gql`
  query FetchAllTags {
    tags {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`

async function fetchAllTags() {
  const { data } = await gqlClient.query({ query: fetchAllTagsQuery })

  return mapTagsSimple(data.tags.data)
}

export { fetchAllTags }