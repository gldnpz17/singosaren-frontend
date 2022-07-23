import slugify from "../common/slugify"
import ContentCardTag from "./ContentCardTag"

export default function HorizontalContentCard({ content: { id, shortDescription, coverImageUrl, title, author, publicationTime, tags } }) {
  const handleClick = (e) => {
    window.location.href = `/contents/${slugify(title)}-${id}`
  }

  return (
    <div
      onClick={handleClick}
      className='md:shadow-md rounded hover:bg-indigo-50 md:hover:shadow-2xl duration-300 h-full bg-white md:bg-indigo-50 overflow-hidden cursor-pointer flex'
    >
      <img src={coverImageUrl} className='h-32 w-32 md:shadow-none md:h-48 md:w-64 object-cover' />
      <div className='px-4 pt-2 pb-4 flex flex-col flex-grow'>
        <div className='mt-1 flex space-x-2'>
          {tags.map(tag => <ContentCardTag key={tag.id} tag={tag} />)}
        </div>
        <div className='font-bold text-xl font-sans-serif'>{title}</div>
        <div className='flex-grow md-block md:hidden' />
        <div className='flex-grow overflow-hidden hidden md:block'>
          <div className='line-clamp-3'>
            {shortDescription}
          </div>
        </div>
        <div className='flex text-sm'>
          <span className='flex-grow text-gray-600'>by <span className='font-semibold inline'>{author}</span></span>
          <div className='text-gray-600'>{publicationTime}</div>
        </div>
      </div>
    </div>
  )
}