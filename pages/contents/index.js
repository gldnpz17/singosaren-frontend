import { gqlClient } from "../../common/gqlClient";
import { gql } from '@apollo/client'
import { DateTime } from 'luxon'
import ContentCard from "../../components/ContentCard";
import SearchField from "../../components/SearchField";
import mapTagsSimple from "../../common/mapper/mapTagsSimple";

const query = gql`
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

export async function getStaticProps() {
  const { data } = await gqlClient.query({ query })

  return ({
    props: {
      contents: data.contents.data.map(({ id, attributes }) => ({
        id,
        coverImageUrl: attributes.coverImage.data.attributes.url,
        title: attributes.title,
        author: attributes.author,
        publicationTime: DateTime.fromISO(attributes.publishedAt).toLocaleString(DateTime.DATE_MED),
        tags: mapTagsSimple(attributes.tags.data)
      }))
    }
  })
}

export default function Contents({ contents }) {
  return (
    <div className="mt-8 mx-36 flex flex-col items-center">
      <div className='mb-6 w-3/4'>
        <SearchField />
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {
          contents.map(content => (
            <ContentCard content={content} />
          ))
        }
      </div>
    </div>
  )
}