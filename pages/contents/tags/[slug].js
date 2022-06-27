import { fetchTagContents } from "../../../api-requests/contents"
import { fetchAllTags } from "../../../api-requests/tags"
import slugify from "../../../common/slugify"
import ContentCard from "../../../components/ContentCard"

export async function getStaticPaths() {
  const tags = await fetchAllTags()

  const slugs = tags.map(tag => `${slugify(tag.name)}-${tag.id}`)

  return ({
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false
  })
}

export async function getStaticProps({ params: { slug } }) {
  const splitParams = slug.split('-')
  const id = splitParams[splitParams.length - 1]

  const { tag, contents } = await fetchTagContents(id)

  return ({
    props: { tag, contents }
  })
}

export default function TagContents({ tag, contents }) {
  return (
    <div className='mt-8 mx-36 flex flex-col items-center'>
      <div className='mb-6'>
        <p>Hasil pencarian untuk tag <b>{tag.name}</b></p>
        <p className='text-gray-500 text-center'>{tag.description}</p>
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {
          contents.map(content => (
            <ContentCard key={content.id} content={content} />
          ))
        }
      </div>
    </div>
  )
}