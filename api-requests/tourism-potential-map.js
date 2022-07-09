import { gql } from '@apollo/client'
import { gqlClient } from '../common/gqlClient'
import { mapContentSimple } from '../common/mapper/contents'

const fetchTourismPotentialMapDataQuery = gql`
  query FetchTourismPotentialMapData {
    tourismPotentialMap {
      data {
        attributes {
          baseMap {
            data {
              attributes {
                url
                width
                height
              }
            }
          }
          markerIcon {
            data {
              attributes {
                url
                width
                height
              }
            }
          }
        }
      }
    }
  }
`

async function fetchTourismPotentialMapData() {
  const { data } = await gqlClient.query({ query: fetchTourismPotentialMapDataQuery })

  const { attributes } = data.tourismPotentialMap.data

  return ({
    baseMap: attributes.baseMap.data.attributes,
    markerIcon: attributes.markerIcon.data.attributes
  })
}

const fetchAllTourismPotentialMapMarkersQuery = gql`
  query FetchAllTourismPotentialMapMarkers {
    tourismPotentialMarkers {
      data {
        id
        attributes {
          name
          xPosition
          yPosition
          coverImage {
            data {
              attributes {
                url
              }
            }
          }
          facilities {
            data {
              attributes {
                tooltip
                iconImage {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

async function fetchAllTourismPotentialMapMarkers() {
  const { data } = await gqlClient.query({ query: fetchAllTourismPotentialMapMarkersQuery })

  const markers = data.tourismPotentialMarkers.data

  return markers.map(marker => {
    const { id, attributes } = marker

    return ({
      id,
      name: attributes.name,
      x: attributes.xPosition,
      y: attributes.yPosition,
      coverImageUrl: attributes.coverImage.data.attributes.url,
      facilities: attributes.facilities.data.map(facility => {
        const { attributes } = facility

        return ({
          tooltip: attributes.tooltip,
          iconUrl: attributes.iconImage.data.attributes.url
        })
      })
    })
  })
}

const fetchAllTourismPotentialsQuery = gql`
  query FetchAllTourismPotentials {
    tourismPotentialMarkers {
      data {
        id
        attributes {
          name
          description
          contents {
            data {
              id
              attributes {
                title
                author
                coverImage {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                publishedAt,
                tags {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

async function fetchAllTourismPotentials() {
  const { data } = await gqlClient.query({ query: fetchAllTourismPotentialsQuery })

  const tourismPotentials = data.tourismPotentialMarkers.data

  return tourismPotentials.map(tourismPotential => {
    const { id, attributes } = tourismPotential

    console.log(attributes.contents.data)

    return ({
      id,
      name: attributes.name,
      description: attributes.description,
      contents: attributes.contents.data.map(mapContentSimple)
    })
  })
}

export {
  fetchTourismPotentialMapData,
  fetchAllTourismPotentialMapMarkers,
  fetchAllTourismPotentials
}