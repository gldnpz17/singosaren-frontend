export default function SearchField() {
  const handleSubmit = (e) => {
    e.preventDefault()

    const params = new URLSearchParams(window.location.search)
    params.set('keywords', e.target.keywords.value)
    window.location.href = `/contents?${params.toString()}`
  }

  return (
    <form onSubmit={handleSubmit} className='relative w-full'>
      <input defaultValue={new URLSearchParams(window.location.search).get('keywords')} name='keywords' className='border placeholder-gray-400 hover:ring-4 duration-200 ring-indigo-200 border-gray-200 text-gray-800 focus-visible:outline-none p-3 rounded w-full' placeholder='Cari Artikel...' />
      <img src='/search-icon.svg' className='absolute top-0 bottom-0 right-0 my-auto mr-3 pointer-events-none' />
    </form>
  )
}