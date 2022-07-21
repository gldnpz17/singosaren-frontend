import { gqlClient } from "../../common/gqlClient"
import { gql } from '@apollo/client'
import slugify from "../../common/slugify"
import { DateTime } from 'luxon'
import ReactMarkdown from 'react-markdown'
import { fetchContentById, fetchContentIdentifiers } from "../../api-requests/contents"
import remarkGfm from "remark-gfm"
import withLayout from "../../higher-order-components/withLayout"
import Layout from "../../layouts/Layout"
import configs from "../../common/configs"
import Head from "next/head"
import { Facebook, Twitter, Whatsapp } from "../../common/icons"

export async function getStaticPaths() {
  const contentIdentifiers = await fetchContentIdentifiers()

  const slugs = contentIdentifiers.map(content => {
    return `${slugify(content.attributes.title)}-${content.id}`
  })

  return ({
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: 'blocking'
  })
}

export async function getStaticProps({ params }) {
  const splitParams = params.slug.split('-')
  const id = splitParams[splitParams.length - 1]

  return ({
    props: {
      content: await fetchContentById(id),
      slug: params.slug
    },
    revalidate: configs.isrDurationSeconds
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

function SocialMediaShareButton({ children, handleClick, className }) {
  return (
    <button onClick={handleClick}
      className={`w-8 h-8 rounded text-white p-1 ${className}`}
    >
      {children}
    </button>
  )
}

function SocialMediaArray({ title, pageUrl }) {
  function handleFacebookShare() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      'facebook-share-dialog',
      'width=626,height=436'
    )
  }

  function handleTwitterShare() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n${pageUrl}`)}`,
      undefined,
      'width=626,height=436'
    )
  }

  function handleWhatsappShare() {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n\n${pageUrl}`)}`,
      undefined,
      'width=626,height=436'
    )
  }

  return (
    <div className='flex gap-3'>
      <SocialMediaShareButton handleClick={handleFacebookShare} className='bg-blue-500'>
        <Facebook />
      </SocialMediaShareButton>
      <SocialMediaShareButton handleClick={handleTwitterShare} className='bg-sky-400'>
        <Twitter />
      </SocialMediaShareButton>
      <SocialMediaShareButton handleClick={handleWhatsappShare} className='bg-green-500'>
        <Whatsapp />
      </SocialMediaShareButton>
    </div>
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
  },
  slug
}) {
  const PAGE_TITLE = `${title} - bokongsemar.id`
  const PAGE_URL = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/contents/${slug}`

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta property="og:url"           content={PAGE_URL} />
        <meta property="og:type"          content="website" />
        <meta property="og:title"         content={PAGE_TITLE} />
        <meta property="og:description"   content="TODO: Fill with something." />
        <meta property="og:image"         content={coverImageUrl} />
      </Head>
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
          <div className='flex mb-2 items-center'>
            <div className='text-gray-500 font-sans-serif flex-grow'>{publicationTime}</div>
            <SocialMediaArray title={title} pageUrl={PAGE_URL} />
          </div>
        </div>
        <hr className='mb-4' />
        <div className='prose prose-slate mb-8'>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <span>
                  <img {...props} className={`${props.className ?? ''} rounded mb-0`} />
                  <span className='text-gray-500 block'>{props.alt}</span>
                </span>
              )
            }}
          >
            {body}
          </ReactMarkdown>
        </div>
        <hr className='mb-6' />
        <div className='flex flex-col items-center mb-8'>
          <div className='font-semibold mb-2'>Sebarkan artikel ini</div>
          <SocialMediaArray title={title} pageUrl={PAGE_URL} />
        </div>
        <div>
          <div className='font-semibold mb-3'>Artikel lainnya</div>
          <div className='flex flex-col gap-4'>
            
          </div>
        </div>
      </div>
    </>
  )
}

export default withLayout(ContentDetails, Layout)