import { eq } from 'drizzle-orm';
import { collectionTypes as collectionTypesTable } from '../db/schema'
import collectionTypeToStations from './collectionTypeToStations'
import db from './db'
import createTableApi from './helper/createTableApi'
import stations, { StationData } from './stations'
const _collectionTypes = createTableApi(collectionTypesTable)

export interface CollectionTypeData {
  name: string;
  description?: string;
  stations?: {
    existing?: number[],
    new?: StationData[]
  }
}

/**
 * Validates the given data object and throws an error if any validation errors occur.
 *
 * @param {CollectionTypeData} data - The data object to be validated.
 * @throws {string} A concatenated string of all validation error messages.
 */
const validate = (data: CollectionTypeData) => {
  const errors = []
  if (!data.name) errors.push({
    message: "no name was given"
  })
  if (errors.length > 0) {
    throw errors.map(err => err.message).toString()
  }
}

/**
 * Adds existing or new stations to a collection type.
 *
 * @param {number} id - The ID of the collection type.
 * @param {CollectionTypeData} data - The data containing the stations to be added.
 * @return {void} This function does not return anything.
 */
const addStationsToCollectionType = (id: number, data: CollectionTypeData) => {
  if (data.stations) {
    if (data.stations.existing) {
      for (const stationId of data.stations.existing) {
        collectionTypeToStations.createOne({
          collectionTypeId: id,
          stationId
        })
      }
    }
    if (data.stations.new) {
      for (const stationData of data.stations.new) {
        const station = stations.upsertOne(stationData)
        collectionTypeToStations.createOne({
          collectionTypeId: id,
          stationId: station.id
        })
      }
    }
  }
}

/**
 * Retrieves a single collection type from the database based on the provided ID.
 *
 * @param {number} id - The ID of the collection type to retrieve.
 * @return {Promise<CollectionType | null>} A promise that resolves to the retrieved collection type, or null if not found.
 */
const getOneCollectionType = (id: number) => db.query.collectionTypes.findFirst({
  where: eq(collectionTypesTable.id, id),
  columns: {
    id: true,
    name: true, 
  },
  with: {
    stations: {
      columns: {},
      with: {
        station: {
          columns: { 
            id: true, 
            name: true
          },
          with: { stationType: true }
        }
      }
    }
  }
})

const collectionTypes = {
  ..._collectionTypes,
  getOne: (id: number) => getOneCollectionType(id),
  /**
   * Retrieves multiple collection types from the database with specified columns and related
   * stations and station types.
   *
   * @return {Promise<CollectionType[]>} A promise that resolves to an array of collection types.
   */
  getMany: () => db.query.collectionTypes.findMany({
    columns: {
      id: true,
      name: true,
    },
    with: {
      stations: {
        columns: {},
        with: {
          station: {
            columns: { 
              id: true, 
              name: true
            },
            with: { stationType: true }
          }
        }
      }
    }
  }),

    /**
     * Creates a new collection type and associates it with existing or new stations.
     *
     * @param {CollectionTypeData} data - The data for creating the collection type.
     * @return {Promise<CollectionType | null>} The created collection type with associated stations, or null if not found.
     */
  createOne: (data: CollectionTypeData) => {
    validate(data)
    const newCollectionType = _collectionTypes.createOne(data)
    
    addStationsToCollectionType(newCollectionType.id, data)
    return getOneCollectionType(newCollectionType.id)
  },

  /**
   * Updates a collection type with the provided ID using the given data.
   *
   * @param {number} id - The ID of the collection type to update.
   * @param {CollectionTypeData} data - The data to update the collection type.
   * @return {Promise<CollectionType | null>} The updated collection type or null if not found.
   */
  updateOne: (id: number, data: CollectionTypeData) => {
    const updatedCollectionType = _collectionTypes.updateOne(id, data)

    addStationsToCollectionType(updatedCollectionType.id, data)
    return getOneCollectionType(updatedCollectionType.id)
  }
}

export default collectionTypes
