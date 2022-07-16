import slugify from "../common/slugify"

function TagButton({ tag: { id, name } }) {
  return (
    <a
      href={`/contents/tags/${slugify(name)}-${id}`}
      className='text-indigo-500 text-sm'
    >
      {name}
    </a>
  )
}

export default function ContentCard({ content: { id, coverImageUrl, title, author, publicationTime, tags } }) {
  const handleClick = (e) => {
    window.location.href = `/contents/${slugify(title)}-${id}`
  }

  return (
    <div
      onClick={handleClick}
      className='shadow-md rounded hover:shadow-2xl duration-300 h-full bg-indigo-50 overflow-hidden cursor-pointer flex flex-col'
    >
      <img src={coverImageUrl} className='h-44 object-cover' />
      <div className='px-4 pt-2 pb-4 flex flex-col flex-grow'>
        <div className='mt-1 flex space-x-2'>
          {tags.map(tag => <TagButton key={tag.id} tag={tag} />)}
        </div>
        <div className='font-bold text-xl font-sans-serif'>{title}</div>
        <div className='flex-grow' />
        <div className='flex text-sm'>
          <span className='flex-grow text-gray-600'>by <span className='font-semibold inline'>{author}</span></span>
          <div className='text-gray-600'>{publicationTime}</div>
        </div>
      </div>
    </div>
  )
}