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

  /**
   * Retrieves multiple stations from the database based on the provided options.
   *
   * @param {Object} [options={withStationType: true}] - Optional parameters for retrieving the stations.
   * @return {Promise<Station[]>} A promise that resolves to an array of stations.
   */
  getMany: (options = {withStationType: true}) => db.query.stations
    .findMany({
      with: {
        stationType: options.withStationType ? true : undefined
      }
    }),

  /**
   * Retrieves a single station from the database based on the provided ID.
   *
   * @param {number} id - The ID of the station to retrieve.
   * @param {Object} [options] - Optional parameters for retrieving the station.
   * @param {boolean} [options.withStationType=true] - Whether to include the station type in the result.
   * @return {Promise<Station | null>} A promise that resolves to the retrieved station, or null if not found.
   */
  getOne: (id: number, options = {withStationType: true}) => db.query.stations
    .findFirst({
      where: eq(stationsTable.id, id),
      with: {
        stationType: options.withStationType ? true : undefined
      }
    }),

    /**
     * Creates a new station in the database.
     *
     * @param {StationData} data - The data for creating the station.
     * @return {Promise<Station>} A promise that resolves to the created station.
     */
  createOne: (data: StationData) => {
    if (!data.newStationType) return _stations.createOne(data)

    const stationType = stationTypes.createOne(data.newStationType)

    return db
      .insert(stationsTable)
      .values({...data, stationTypeId: stationType.id })
      .returning()
      .get()      
  },

  /**
   * A function that updates a station's information in the database.
   *
   * @param {number} id - The ID of the station to update.
   * @param {StationData} data - The new data for the station.
   * @return {Promise<Station>} A promise that resolves to the updated station data.
   */
  updateOne: (id: number, data: StationData) => {
    if (!data.newStationType) return _stations.updateOne(id, data)
    
    const stationType = stationTypes.createOne(data.newStationType)
    return db
      .update(stationsTable)
      .set({...data, stationTypeId: stationType.id})
      .where(eq(stationsTable.id, id))
      .returning()
      .get()
  },
  
  /**
   * Inserts a new station into the database or updates an existing one if it already exists.
   *
   * @param {StationData} data - The data of the station to be inserted or updated.
   * @return {Promise<Station>} A promise that resolves to the inserted or updated station.
   */
  upsertOne: (data: StationData) => {
    if (!data.newStationType) return  _stations.createOne(data)

    const stationType = stationTypes.createOne(data.newStationType)
    return db
      .insert(stationsTable)
      .values({...data, stationTypeId: stationType.id })
      .onConflictDoUpdate({
        target: [stationsTable.id],
        set: data
      })
      .returning()
      .get()
  }
}

export default stations
