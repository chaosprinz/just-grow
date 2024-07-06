import { eq } from 'drizzle-orm';
import { collectionTypes as collectionTypesTable } from '../db/schema'
import collectionTypeToStations from './collectionTypeToStations';
import db from './db'
import createTableApi from './helper/createTableApi'
import stations, { StationData } from './stations';

const _collectionTypes = createTableApi(collectionTypesTable)

export interface CollectionTypeData {
  name: string;
  description?: string;
  stations?: {
    existing?: number[],
    new?: StationData[]
  }
}

const validateNew = (data: CollectionTypeData) => {
  const errors = []
  if (!data.name) errors.push({
    message: "no name was given"
  })
  return errors
}

const collectionTypes = {
  ..._collectionTypes,
  createOne: (data: CollectionTypeData) => {
    const errors = validateNew(data)
    if (errors.length > 0) {
      throw errors.map(err => err.message).toString()
    }
    const newCollectionType = _collectionTypes.createOne(data)
    
    if (data.stations) {
      if (data.stations.existing) {
        for (let i = 0; i < data.stations.existing.length; i++) {
          collectionTypeToStations.createOne({
            collectionTypeId: newCollectionType.id,
            stationId: data.stations.existing[i]
          })
        }
      }
      
      if (data.stations.new) {
        for (let i = 0; i < data.stations.new.length; i++) {
          const station = stations.createOne(data.stations.new[i])

          collectionTypeToStations.createOne({
            collectionTypeId: newCollectionType.id,
            stationId: station.id
          })
        }
      }
    }

    const fullCollectionType = db.query.collectionTypes.findFirst({
      where: eq(collectionTypesTable.id, newCollectionType.id),
      with: {
        stations: {
          with: {
            station: true
          }
        }
      }
    })

    return fullCollectionType
  }
}

export default collectionTypes
