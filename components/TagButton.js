import slugify from "../common/slugify";

export default function TagButton({ tag: { id, name }, active }) {


  return (
    <a
      href={active ? '/contents' : `/contents?tag=${id}`}
      className={`py-2 px-4 rounded whitespace-nowrap hover:brightness-95 duration-100 ${active ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-700'}  font-medium`}
    >
      {name}
    </a>
  )
}