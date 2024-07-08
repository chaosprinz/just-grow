import { createOne, eq } from 'drizzle-orm'
import { tempHumidMeasurements as tempHumidMeasurementsTable,
  measurementCollections as measurementCollectionsTable,
  stations as stationsTable,
  stationTypes as stationTypesTable
 } from '../db/schema'
import db from './db'
import createTableApi from './helper/createTableApi'
import stations, { StationData } from './stations'
import measurementCollections, { MeasurementCollectionData } from './measurementCollections'

const _tempHumidMeasurements = createTableApi(tempHumidMeasurementsTable)

export interface TempHumidMeasurementData {
  temperature: number
  humidity: number
  stationId?: number
  collectionId?: number
  newStation?: StationData
  newCollection?: MeasurementCollectionData
}


const getOneTempHumidMeasurement = (id: number) => db.query.tempHumidMeasurements.findFirst({
  columns: {
    id: true,
    temperature: true,
    humidity: true,
  },
  where: eq(tempHumidMeasurementsTable.id, id),
  with: {
    station: {
      columns: { 
        id: true, 
        name: true
      },
      with: { stationType: true }
    },
    collection: { 
      columns: {
        id: true,
        createdAt: true,
        updatedAt: true
      },
      with: { collectionType: true  }
    }
  }
})

const tempHumidMeasurements = {
  ..._tempHumidMeasurements,

  /**
   * Retrieves multiple tempHumidMeasurements from the database with specified columns and related station and collection information.
   *
   * @return {type} A promise that resolves to an array of tempHumidMeasurements.
   */
  getMany: () => db.query.tempHumidMeasurements.findMany({
    columns: {
      id: true,
      temperature: true,
      humidity: true,
    },
    with: {
      station: {
        columns: { 
          id: true, 
          name: true
        },
        with: { stationType: true }
      },
      collection: { 
        columns: {
          id: true,
          createdAt: true,
          updatedAt: true
        },
        with: { collectionType: true  }
      }
    }
  }),

  getOne: (id: number) => getOneTempHumidMeasurement(id),

  /**
   * A function that creates a new TempHumidMeasurement record based on the provided data.
   *
   * @param {TempHumidMeasurementData} data - The data to create the TempHumidMeasurement record.
   * @return {ReturnType<typeof getOneTempHumidMeasurement>} The created TempHumidMeasurement record.
   */
  createOne: (data: TempHumidMeasurementData) => {
    if (data.newCollection) data.collectionId = measurementCollections.createOne(data.newCollection).id
    if (data.newStation) data.stationId = stations.createOne(data.newStation).id
    const newMeasurementId = _tempHumidMeasurements.createOne(data).id
    return getOneTempHumidMeasurement(newMeasurementId)
  },

  updateOne: (id: number, data: TempHumidMeasurementData) => {
    if (data.newCollection) data.collectionId = measurementCollections.createOne(data.newCollection).id
    if (data.newStation) data.stationId = stations.createOne(data.newStation).id
    const newMeasurementId = _tempHumidMeasurements.updateOne(id, data).id
    return getOneTempHumidMeasurement(newMeasurementId)
  }
}

export default tempHumidMeasurements
