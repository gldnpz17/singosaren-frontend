import { gql } from "@apollo/client";
import { gqlClient } from "../common/gqlClient";
import { mapTourPackageDetailed, mapTourPackagesSimple } from "../common/mapper/tour-packages";

const fetchAllTourPackagesQuery = gql`
  query FetchAllTourPackages {
    tourPackages {
      data {
        id
        attributes {
          name
          images {
            data {
              attributes {
                url
              }
            }
          }
          price
          shortDescription
        }
      }
    }
  }
`

async function fetchAllTourPackages() {
  const { data } = await gqlClient.query({ query: fetchAllTourPackagesQuery })

  return data.tourPackages.data.map(mapTourPackagesSimple)
}

const fetchAllTourPackageIdentifiersQuery = gql`
  query fetchAllTourPackages {
    tourPackages {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`

async function fetchAllTourPackageIdentifiers() {
  const { data } = await gqlClient.query({ query: fetchAllTourPackageIdentifiersQuery })

  return data.tourPackages.data.map(tourPackage => {
    const { id, attributes } = tourPackage

    return ({
      id,
      name: attributes.name
    })
  })
}

const fetchTourPackageByIdQuery = gql`
  query fetchTourPackageById($id: ID) {
    tourPackage(id: $id) {
      data {
        id
        attributes {
          name
          shortDescription
          price
          images {
            data {
              id
              attributes {
                url
                alternativeText
              }
            }
          }
          details
        }
      }
    }
  }
`

async function fetchTourPackageById(id) {
  const { data } = await gqlClient.query({ query: fetchTourPackageByIdQuery, variables: { id } })

  return mapTourPackageDetailed(data.tourPackage.data)
}

export {
  fetchAllTourPackages,
  fetchAllTourPackageIdentifiers,
  fetchTourPackageById
}