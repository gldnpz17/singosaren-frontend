import { gqlClient } from "../../common/gqlClient"
import { gql } from '@apollo/client'
import slugify from "../../common/slugify"
import { DateTime } from 'luxon'
import mapTagsSimple from "../../common/mapper/mapTagsSimple"
import TagButton from "../../components/TagButton"
import ReactMarkdown from 'react-markdown'

const fetchContentById = gql`
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

const fetchContentIdentifiers = gql`
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

export async function getStaticPaths() {
  const { data } = await gqlClient.query({ query: fetchContentIdentifiers })

  const slugs = data.contents.data.map(content => {
    return `${slugify(content.attributes.title)}-${content.id}`
  })

  return ({
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false
  })
}

export async function getStaticProps({ params }) {
  const splitParams = params.slug.split('-')
  const id = splitParams[splitParams.length - 1]

  const { data } = await gqlClient.query({ query: fetchContentById, variables: { id } })

  const { attributes } = data.content.data

  return ({
    props: {
      content: {
        id,
        coverImageUrl: attributes.coverImage.data.attributes.url,
        title: attributes.title,
        author: attributes.author,
        publicationTime: DateTime.fromISO(attributes.publishedAt).toLocaleString(DateTime.DATE_MED),
        tags: mapTagsSimple(attributes.tags.data),
        body: attributes.body
      }
    }
  })
}

export default function ContentDetails({ content }) {
  return (
    <div className='mx-80 my-28'>
      <div className='mb-4'>
        <h1 className='text-2xl'>{content.title}</h1>
        <p>Oleh {content.author} pada {content.publicationTime}</p>
        <div className='mt-1 flex space-x-2 items-center'>
          <span>Tags: </span>
          {content.tags.map(tag => <TagButton tag={tag} />)}
        </div>
      </div>
      <img className='mb-4' src={content.coverImageUrl} />
      <ReactMarkdown>{content.body}</ReactMarkdown>
    </div>
  )
}