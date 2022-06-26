import slugify from "../common/slugify";

export default function TagButton({ tag: { id, name } }) {
  return (
    <a
      href={`/contents/tags/${slugify(name)}-${id}`}
      className='p-1 rounded-md border border-gray-500'
    >
      {name}
    </a>
  )
}