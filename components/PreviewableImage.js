import { useLightbox } from "../hooks/useLightbox"

function PreviewableImage({ src, className }) {
  const { open } = useLightbox()

  return (
    <img src={src} className={`rounded max-h-96 w-full object-cover ${className}`} onClick={() => open(src)} />
  )
}

export default PreviewableImage