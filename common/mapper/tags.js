function mapTagsSimple(tags) {
  return tags.map(tag => ({
    id: tag.id,
    name: tag.attributes.name
  }))
}

export { mapTagsSimple }