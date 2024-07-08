import { eq } from 'drizzle-orm'
import { tempHumidMeasurements as tempHumidMeasurementsTable,
  measurementCollections as measurementCollectionsTable,
  stations as stationsTable,
  stationTypes as stationTypesTable
 } from '../db/schema'
import db from './db'
import createTableApi from './helper/createTableApi'

const _tempHumidMeasurements = createTableApi(tempHumidMeasurementsTable)

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

  getOne: (id: number) => getOneTempHumidMeasurement(id)
}

export default tempHumidMeasurements
