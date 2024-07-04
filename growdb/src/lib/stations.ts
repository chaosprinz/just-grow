import { stations as stationsTable } from '../db/schema'
import db from './db'
import createTableApi from './helper/createTableApi'
import stationTypes from './stationTypes'

const stations = createTableApi(stationsTable)

stations.createOne = (data: any): Record<string, unknown> => {
  if (!data.newStationType) {
    return db.insert(stationsTable).values(data).returning().get()
  }

  const stationType = stationTypes.createOne(data.newStationType)

  return db
    .insert(stationsTable)
    .values({...data, stationTypeId: stationType.id})
    .returning()
    .get()
}

export default stations
