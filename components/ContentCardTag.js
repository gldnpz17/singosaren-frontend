export default function ContentCardTag({ tag: { id, name } }) {
  return (
    <a
      href={`/contents?tag=${id}`}
      className='text-indigo-500 text-sm'
    >
      {name}
    </a>
  )
}