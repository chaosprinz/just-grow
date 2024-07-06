import { eq } from 'drizzle-orm'
import { stations as stationsTable } from '../db/schema'
import db from './db'
import createTableApi from './helper/createTableApi'
import stationTypes from './stationTypes'

export interface StationData {
  name: string;
  stationTypeId?: number | undefined;
  newStationType?: {
    name: string;
  }
}

const _stations = createTableApi(stationsTable)

const stations = {
  ..._stations,

  getMany: (options = {withStationType: true}) => db.query.stations
    .findMany({
      with: {
        stationType: options.withStationType ? true : undefined
      }
    }),

  getOne: (id: number, options = {withStationType: true}) => db.query.stations
    .findFirst({
      where: eq(stationsTable.id, id),
      with: {
        stationType: options.withStationType ? true : undefined
      }
    }),

  createOne: (data: StationData) => {
    if (!data.newStationType) return _stations.createOne(data)

    const stationType = stationTypes.createOne(data.newStationType)

    return db
      .insert(stationsTable)
      .values({...data, stationTypeId: stationType.id })
      .returning()
      .get()      
  },

  updateOne: (id: number, data: StationData) => {
    if (!data.newStationType) return _stations.updateOne(id, data)
    
    console.log(data)
    const stationType = stationTypes.createOne(data.newStationType)
    return db
      .update(stationsTable)
      .set({...data, stationTypeId: stationType.id})
      .where(eq(stationsTable.id, id))
      .returning()
      .get()
  }
}

export default stations
