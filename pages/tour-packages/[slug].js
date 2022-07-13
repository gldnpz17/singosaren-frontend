import { fetchAllTourPackageIdentifiers, fetchTourPackageById } from "../../api-requests/tour-packages"
import Format from "../../common/format"
import slugify from "../../common/slugify"
import remarkGfm from "remark-gfm"
import ReactMarkdown from 'react-markdown'

export async function getStaticPaths() {
  const tourPackageIdentifiers = await fetchAllTourPackageIdentifiers()

  const slugs = tourPackageIdentifiers.map(({ id, name }) => `${slugify(name)}-${id}`)

  return ({
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false
  })
}

export async function getStaticProps({ params }) {
  const splitParams = params.slug.split('-')
  const id = splitParams[splitParams.length - 1]

  return ({
    props: {
      tourPackage: await fetchTourPackageById(id)
    }
  })
}

export default function TourPackageDetails({
  tourPackage: { id, name, images, price, shortDescription, details }
}) {
  return (
    <div className='grid grid-cols-12 m-8 gap-6 mx-60'>
      <div className='col-span-8'>
        <h1 className='text-3xl font-bold mb-2'>{name}</h1>
        <p className='text-gray-500 mb-2'>{shortDescription}</p>
        <hr className='mb-2' />
        <div className='snap-x flex w-full gap-6 overflow-x-auto mb-4'>
          {images.map(image => (
            <div className='my-8 snap-center rounded-md overflow-hidden shrink-0 relative'>
              <img
                className='h-56'
                key={image.id}
                src={image.url}
                alt={image.alternativeText}
              />
              <div className='absolute bottom-0 left-0 right-0 p-2 bg-white opacity-70 rounded-md'>
                {image.alternativeText}
              </div>
            </div>
          ))}
        </div>
        <div className='prose prose-slate'>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{details}</ReactMarkdown>
        </div>
      </div>
      <div className='col-span-4'>
        <div className='shadow-md p-4 rounded-md'>
          <div className='font-semibold'>Harga</div>
          <div className='font-semibold text-xl text-gray-500 mb-3'>{Format.currency(price)}</div>
          <div className='mb-1 text-sm'>Tertarik? Hubungi salah satu kontak berikut :</div>
          <ul className='flex flex-col gap-2'>
            <li className='p-2 border border-gray-300 rounded-md flex items-center'>
              <img src="/whatsapp.svg" className='h-6 mr-1' />
              <span className='flex-grow'>(+62)0123456789</span> 
            </li>
            <li className='p-2 border border-gray-300 rounded-md flex items-center'>
              <img src="/whatsapp.svg" className='h-6 mr-1' />
              <span className='flex-grow'>(+62)0987654321</span> 
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}