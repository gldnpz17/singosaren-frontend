import { fetchAllTourPackages } from "../../api-requests/tour-packages"
import Format from "../../common/format"
import slugify from "../../common/slugify"

function TourPackageCard({ 
  tourPackage: { 
    id, 
    name, 
    mainImageUrl,  
    price,
    shortDescription
  } 
}) {
  const handleClick = () => {
    window.location.href = `/tour-packages/${slugify(name)}-${id}`
  }

  return (
    <div
      onClick={handleClick} 
      className="shadow-md p-4 flex items-center rounded-md hover:shadow-lg duration-200 cursor-pointer"
    >
      <img src={mainImageUrl} className="mr-4 rounded-md min-h-full h-0 object-cover aspect-square" />
      <div>
        <div className='line-clamp-1 font-semibold'>{name}</div>
        <div className='text-gray-500'>{Format.currency(price)}</div>
        <p className='line-clamp-2'>{shortDescription}</p>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  return ({
    props: {
      tourPackages: await fetchAllTourPackages()
    }
  })
}

export default function TourPackages({ tourPackages }) {
  return (
    <div className='mt-8 mx-36'>
      <h1 className='text-center font-semibold text-lg mb-4'>Paket Wisata Singosaren</h1>
      <div className="grid grid-cols-2 gap-4">
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