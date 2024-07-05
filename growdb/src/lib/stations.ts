import { eq } from 'drizzle-orm'
import { stations as stationsTable } from '../db/schema'
import db from './db'
import createTableApi from './helper/createTableApi'
import stationTypes from './stationTypes'

const _stations = createTableApi(stationsTable)

const stations = {
  ..._stations,
  getMany: async(options = {
    withStationType: true
  }) => {
    return await db.query.stations.findMany({
      with: {
        stationType: options.withStationType ? true : undefined
      }
    })
  },

  getOne: async (id: number, options = {withStationType: true}) => {
    return await db.query.stations.findFirst({
      with: {
        stationType: options.withStationType ? true : undefined
      },
      where: eq(stationsTable.id, id)
    })
  },

  createOne: (data: any) => {
    if (!data.newStationType) return _stations.createOne(data)

    const stationType = stationTypes.createOne(data.newStationType)

    return db
      .insert(stationsTable)
      .values({...data, stationTypeId: stationType.id})
      .returning()
      .get()      
  },

  updateOne: (id: number, data: any) => {
    if (!data.newStationType) return _stations.updateOne(id, data)

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
