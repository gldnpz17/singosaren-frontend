import { DateTime } from "luxon"
import { mapTagsSimple } from "./tags"

function mapContentSimple(content) {
  const { id, attributes } = content 

  return ({
    id,
    coverImageUrl: attributes.coverImage.data.attributes.url,
    shortDescription: attributes.shortDescription,
    title: attributes.title,
    author: attributes.author,
    publicationTime: DateTime.fromISO(attributes.publishedAt).toLocaleString(DateTime.DATE_MED),
    tags: mapTagsSimple(attributes.tags.data)
  })
}

export { mapContentSimple }