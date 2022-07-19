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
        }
      }
    }
  }
`

async function fetchAllTourPackages() {
  const { data } = await gqlClient.query({ query: fetchAllTourPackagesQuery, fetchPolicy: 'no-cache' })

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
  const { data } = await gqlClient.query({ query: fetchAllTourPackageIdentifiersQuery, fetchPolicy: 'no-cache' })

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
          contacts {
            data {
              id
              attributes {
                name
                url
                contactType {
                  data {
                    attributes {
                      name
                      icon {
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
      }
    }
  }
`

async function fetchTourPackageById(id) {
  const { data } = await gqlClient.query({ query: fetchTourPackageByIdQuery, variables: { id }, fetchPolicy: 'no-cache' })

  return mapTourPackageDetailed(data.tourPackage.data)
}

export {
  fetchAllTourPackages,
  fetchAllTourPackageIdentifiers,
  fetchTourPackageById
}