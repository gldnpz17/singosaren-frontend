import { mapImageSimple } from "./images"

function mapTourPackagesSimple(tourPackage) {
  const { id, attributes } = tourPackage

  return ({
    id,
    name: attributes.name,
    mainImageUrl: attributes.images.data[0].attributes.url,
    price: attributes.price,
    shortDescription: attributes.shortDescription
  })
}

function mapTourPackageDetailed(tourPackage) {
  const { id, attributes } = tourPackage

  return ({
    id,
    name: attributes.name,
    images: attributes.images.data.map(mapImageSimple),
    price: attributes.price,
    shortDescription: attributes.shortDescription,
    details: attributes.details
  })
}

export { 
  mapTourPackagesSimple,
  mapTourPackageDetailed
}