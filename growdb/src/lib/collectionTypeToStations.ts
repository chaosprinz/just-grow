import { collectionTypeToStations as collectionTypeToStationTable } from '../db/schema'
import db from './db'
import createTableApi from './helper/createTableApi'

const _collectionTypeToStations = createTableApi(collectionTypeToStationTable)

export interface CollectionTypeToStationData {
  collectionTypeId: number
  stationId: number
}

const collectionTypeToStations = {
  ..._collectionTypeToStations,
  /**
   * Creates a new entry in the collectionTypeToStationTable 
   * or updates it if it already exists.
   *
   * @param {CollectionTypeToStationData} data - The data to be inserted into the collectionTypeToStationTable.
   * @return {collectionTypeToStation} The result of the insert operation.
   */
  createOne: (data: CollectionTypeToStationData) => db.insert(collectionTypeToStationTable)
    .values(data)
    .onConflictDoUpdate({
      target: [collectionTypeToStationTable.collectionTypeId, collectionTypeToStationTable.stationId],
      set: data
    })
    .returning()
    .get()
}

export default collectionTypeToStations