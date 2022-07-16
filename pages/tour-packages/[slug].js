import { fetchAllTourPackageIdentifiers, fetchTourPackageById } from "../../api-requests/tour-packages"
import Format from "../../common/format"
import slugify from "../../common/slugify"
import remarkGfm from "remark-gfm"
import ReactMarkdown from 'react-markdown'
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper"

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

function CarouselNavButton({ classKey, side, children }) {
  return (
    <div
      onClick={e => e.stopPropagation()} 
      id={`${classKey}-carousel-${side}`}
      className={`absolute ${side === 'left' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'} top-1/2 -translate-y-1/2 z-50 bg-gray-200 border border-gray-100 h-6 w-6 flex items-center justify-center hover:brightness-105 duration-500 select-none`}
    >
      {children}
    </div>
  )
}

export default function TourPackageDetails({
  tourPackage: { name, images, price, contacts, details }
}) {
  const classKey = 'tour-package-details'

  return (
    <div className='grid grid-cols-12 m-8 gap-6 mx-60'>
      <div className='col-span-8'>
        <h1 className='text-3xl h-12 font-bold mb-8'>{name}</h1>
        <div className='w-full h-96 mb-8 relative'>
          <Swiper
            navigation={{
              enabled: true,
              nextEl: `#${classKey}-carousel-right`,
              prevEl: `#${classKey}-carousel-left`
            }}
            modules={[Navigation]}
            className='w-full h-full'
          >
            {images.map(image => (
              <SwiperSlide key={image.id} className='rounded overflow-hidden'>
                <img src={image.url} alt={image.alternativeText} className='w-full h-full object-cover' />
                <div className='absolute bottom-0 left-0 right-0 p-4 bg-black text-white opacity-70'>
                  {image.alternativeText}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <CarouselNavButton classKey={classKey} side='left' >
            <img src='/chevron-left.svg' />
          </CarouselNavButton>
          <CarouselNavButton classKey={classKey} side='right' >
            <img src='/chevron-right.svg' />
          </CarouselNavButton>
        </div>
        <div className='p-4 pt-6 border border-gray-500'>
          <h2 className='text-2xl font-semibold mb-4'>Tentang</h2>
          <div className='prose prose-slate'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{details}</ReactMarkdown>
          </div>
        </div>
      </div>
      <div className='col-span-4'>
        <div className='p-4 rounded border border-gray-200 mt-20 top-12 sticky'>
          <div className='font-semibold font-sans-serif'>Harga</div>
          <div className='font-semibold text-xl text-gray-500 mb-6'>{Format.currency(price)}</div>
          <div className='mb-1 text-sm'>Tertarik? Hubungi salah satu kontak berikut :</div>
          <ul className='flex flex-col gap-2'>
            {contacts.map(contact => (
              <li key={contact.id} className='p-2 border border-gray-300 rounded'>
                <a href={contact.url} className='flex items-center'>
                  <img src={contact.type.iconUrl} className='h-6 mr-1' />
                  <span className='flex-grow'>{contact.name}</span> 
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}