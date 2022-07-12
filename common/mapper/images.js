function mapImageSimple(image) {
  const { id, attributes: { url, alternativeText } } = image

  return ({ id, url, alternativeText })
}

export {
  mapImageSimple
}