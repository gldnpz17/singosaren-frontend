import slugify from "../common/slugify"
import TagButton from "./TagButton"

export default function ContentCard({ content: { id, coverImageUrl, title, author, publicationTime, tags } }) {
  const handleClick = (e) => {
    window.location.href = `/contents/${slugify(title)}-${id}`
  }

  return (
    <div
      onClick={handleClick}
      className='shadow-md rounded-md overflow-hidden cursor-pointer'
    >
      <img src={coverImageUrl} />
      <div className='px-4 pt-2 pb-4'>
        <p className='font-semibold'>{title}</p>
        <p>Oleh {author}</p>
        <p>{publicationTime}</p>
        <div className='mt-1 flex space-x-2'>
          {tags.map(tag => <TagButton tag={tag} />)}
        </div>
      </div>
    </div>
  )
}