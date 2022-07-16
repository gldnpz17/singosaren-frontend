import { mapImageSimple } from "./images"

function mapTourPackagesSimple(tourPackage) {
  const { id, attributes } = tourPackage

  return ({
    id,
    name: attributes.name,
    imageUrls: attributes.images.data.map(image => image.attributes.url),
    price: attributes.price
  })
}

function mapTourPackageDetailed(tourPackage) {
  const { id, attributes } = tourPackage

  return ({
    id,
    name: attributes.name,
    images: attributes.images.data.map(mapImageSimple),
    price: attributes.price,
    details: attributes.details,
    contacts: attributes.contacts.data.map(contact => ({
      id: contact.id,
      name: contact.attributes.name,
      url: contact.attributes.url,
      type: {
        name: contact.attributes.contactType.data.attributes.name,
        iconUrl: contact.attributes.contactType.data.attributes.icon.data.attributes.url
      }
    }))
  })
}

export { 
  mapTourPackagesSimple,
  mapTourPackageDetailed
}