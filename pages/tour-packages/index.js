import { fetchAllTourPackages } from "../../api-requests/tour-packages"
import Format from "../../common/format"
import slugify from "../../common/slugify"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper"
import { useEffect, useMemo } from "react"
import Layout from "../../layouts/Layout"
import withLayout from "../../higher-order-components/withLayout"
import configs from "../../common/configs"
import Head from 'next/head'

function CarouselNavButton({ classKey, side, children }) {
  return (
    <div
      onClick={e => e.stopPropagation()} 
      id={`${classKey}-carousel-${side}`}
      className={`carousel-nav absolute ${side === 'left' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 z-50 bg-gray-200 border border-gray-100 h-6 w-6 flex items-center justify-center hover:brightness-105 duration-500 select-none`}
    >
      {children}
    </div>
  )
}

function TourPackageCard({ 
  tourPackage: { 
    id, 
    name, 
    imageUrls,  
    price
  } 
}) {
  const handleClick = () => {
    window.location.href = `/tour-packages/${slugify(name)}-${id}`
  }

  const classKey = useMemo(() => `tour-package-${id}`, [id])

  return (
    <>
      <Head>
        <title>Indeks Paket Wisata - bokongsemar.id</title>
      </Head>
      <div
        onClick={handleClick} 
        className="flex md:flex-col rounded-md md:items-center duration-200 cursor-pointer relative"
      >
        <img src={imageUrls[0]} className='md:hidden h-16 w-16 object-cover rounded mr-3' />
        <div className='carousel-container relative w-full aspect-square mb-4 rounded overflow-hidden hidden md:block'>
          <Swiper
            navigation={{
              enabled: true,
              nextEl: `#${classKey}-carousel-right`,
              prevEl: `#${classKey}-carousel-left`
            }}
            pagination={{
              dynamicBullets: true
            }}
            modules={[Pagination, Navigation]}
            className='w-full h-full'
          >
            {imageUrls.map(url => (
              <SwiperSlide key={url}>
                <img src={url} className='h-full w-full object-cover' />
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
        <div>
          <div className='line-clamp-1 font-semibold text-lg font-sans-serif'>{name}</div>
          <div className="text-gray-500 font-sans text-sm">{Format.currency(price)}</div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return ({
    props: {
      tourPackages: await fetchAllTourPackages()
    },
    revalidate: configs.isrDurationSeconds
  })
}

function TourPackages({ tourPackages }) {
  return (
    <div className='w-full'>
      <h1 className='font-bold text-2xl mb-8 text-center'>Paket Wisata Singosaren - Jagalan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-3 xl:gap-x-20 gap-y-4 md:gap-y-12 mb-8 w-full">
        {tourPackages.map(tourPackage => (
          <TourPackageCard
            key={tourPackage.id}
            tourPackage={tourPackage}
          />   
        ))}     
      </div>
    </div>
  )
}

export default withLayout(TourPackages, Layout)