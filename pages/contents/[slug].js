import { gqlClient } from "../../common/gqlClient"
import { gql } from '@apollo/client'
import slugify from "../../common/slugify"
import { DateTime } from 'luxon'
import TagButton from "../../components/TagButton"
import ReactMarkdown from 'react-markdown'
import { fetchContentById, fetchContentIdentifiers } from "../../api-requests/contents"
import remarkGfm from "remark-gfm"

export async function getStaticPaths() {
  const contentIdentifiers = await fetchContentIdentifiers()

  const slugs = contentIdentifiers.map(content => {
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

  return ({
    props: {
      content: await fetchContentById(id)
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
      <div className='prose prose-slate'>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.body}</ReactMarkdown>
      </div>
    </div>
  )
}