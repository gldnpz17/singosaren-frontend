import { gqlClient } from "../../common/gqlClient"
import { gql } from '@apollo/client'
import slugify from "../../common/slugify"
import { DateTime } from 'luxon'
import ReactMarkdown from 'react-markdown'
import { fetchContentById, fetchContentIdentifiers } from "../../api-requests/contents"
import remarkGfm from "remark-gfm"
import withLayout from "../../higher-order-components/withLayout"
import Layout from "../../layouts/Layout"

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

function TagButton({ tag: { id, name } }) {
  return (
    <a
      className='font-semibold font-sans-serif text-indigo-600'
      href={`/contents?tag=${id}`}
    >
      {name}
    </a>
  )
}

function ContentDetails({ 
  content: {
    coverImageUrl,
    tags,
    author,
    title,
    publicationTime,
    body
  }
}) {
  return (
    <div className='w-full max-w-2xl'>
      <img className='mb-4 rounded' src={coverImageUrl} />
      <div className='mb-4'>
        <div className='mt-1 mb-2 flex space-x-2 items-center'>
          {tags.map(tag => 
            <TagButton
              key={tag.id}
              tag={tag}
            />
          )}
        </div>
        <div className='mb-2 font-sans-serif font-semibold'>{author}</div>
        <h1 className='mb-2 text-2xl font-sans-serif font-semibold'>{title}</h1>
        <div className='mb-2 text-gray-500 font-sans-serif'>{publicationTime}</div>
      </div>
      <hr className='mb-4' />
      <div className='prose prose-slate'>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }) => (
              <span>
                <img {...props} className={`${props.className ?? ''} rounded mb-0`} />
                <span className='text-gray-500'>{props.alt}</span>
              </span>
            )
          }}
        >
          {body}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default withLayout(ContentDetails, Layout)