import { Zoom } from "../common/icons"
import { useLightbox } from "../hooks/useLightbox"

function PreviewableImage({ src, className }) {
  const { open } = useLightbox()

  return (
    <span className={`max-h-96 w-full group relative overflow-hidden rounded ${className} block`}>
      <span className='z-40 bg-black opacity-0 group-hover:opacity-50  duration-150 absolute top-0 bottom-0 left-0 right-0'>
      </span>
      <button onClick={() => open(src)} 
        className='h-16 w-16 z-50 group-hover:opacity-100 opacity-0 duration-150 -translate-x-1/2 -translate-y-1/2 hover:text-indigo-500 text-white absolute top-1/2 left-1/2'
      >
        <Zoom />
      </button>
      <img src={src} className='h-full max-h-96 w-full m-0 not-prose object-cover' />
    </span>
  )
}

export default PreviewableImage