import { eq } from 'drizzle-orm'
import { stations as stationsTable } from '../db/schema'
import { stationTypes as stationTypesTable } from '../db/schema'
import db from './db'
import createTableApi from './helper/createTableApi'
import stationTypes from './stationTypes'

const _stations = createTableApi(stationsTable)

const selectJoinedStations = () => db
  .select({
    id: stationsTable.id,
    name: stationsTable.name,
    stationType: stationTypesTable
  })
  .from(stationsTable)
  .leftJoin(stationTypesTable, eq(stationsTable.stationTypeId, stationTypesTable.id))

const stations = {
  ..._stations,
  getMany: (withStationType: boolean = true) => {
    if (!withStationType) return _stations.getMany()
    
    return selectJoinedStations()
      .all()
      .reduce<Record<number, { id: number; name: string; stationType: any}>>(
        (acc, row) => {
          const { id, name, stationType } = row
          
          if (!acc[id]) acc[id] = { id, name, stationType: {}}

          if (stationType) acc[id].stationType = stationType

          return acc
        },
        {}
      )
  },

  getOne: (id: number, withStationType: boolean = true): Record<string, unknown> | undefined => {
    if (!withStationType) return _stations.getOne(id)

    return selectJoinedStations()
      .where(eq(stationsTable.id, id))
      .get()
  },

  createOne: (data: any): Record<string, unknown> => {
    if (!data.newStationType) return _stations.createOne(data)

    const stationType = stationTypes.createOne(data.newStationType)

    return db
      .insert(stationsTable)
      .values({...data, stationTypeId: stationType.id})
      .returning()
      .get()      
  },

  updateOne: (id: number, data: any): Record<string, unknown> => {
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
