import slugify from "../common/slugify";

export default function TagButton({ tag: { id, name }, active }) {
  const applyTag = (id) => {
    const params = new URLSearchParams(window.location.search)
    if (id) {
      params.set('tag', id)
    } else {
      params.delete('tag')
    }
    window.location.href = `/contents?${params.toString()}`
  }

  return (
    <button
      onClick={() => applyTag(active ? null : id)}
      className={`py-2 px-4 rounded whitespace-nowrap hover:brightness-95 duration-100 ${active ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-700'}  font-medium`}
    >
      {name}
    </button>
  )
}