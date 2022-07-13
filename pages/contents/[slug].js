import { gqlClient } from "../../common/gqlClient"
import { gql } from '@apollo/client'
import slugify from "../../common/slugify"
import { DateTime } from 'luxon'
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

export default function ContentDetails({ 
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
    <div className='mx-96 my-28'>
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
        <hr />
      </div>
      <div className='prose prose-slate'>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }) => (
              <div>
                <img {...props} className={`${props.className} rounded mb-0`} />
                <div className='text-gray-500'>{props.alt}</div>
              </div>
            )
          }}
        >
            {body}
        </ReactMarkdown>
      </div>
    </div>
  )
}