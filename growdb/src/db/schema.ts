import { relations, sql } from "drizzle-orm"
import { text, integer, sqliteTable, primaryKey } from "drizzle-orm/sqlite-core"

/** 
 * # Stations
 * 
 * Stations are measurement-devices from which data will be collected.
 * Every station needs a stationType, which describes what kind of data
 * its station collects. 
 *
 * */

/**
 * ## stationType
 * describes which kind of data is collected by a station.
 * 
 * data:
 *  - id (primary key to find it )
 *  - name (unique name describing whoch kind of data will be collected) 
 */
export const stationTypes = sqliteTable('stationTypes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name')
    .notNull()
    .unique()
})

/**
 * ### stationTypeRelations
 *  - many->one-relation to stations 
 */
export const stationTypeRelations = relations(stationTypes, ({ many }) =>({
  stations: many(stations)
}))

/**
 * ## station
 * well... the actual station
 * 
 * data:
 * id (primary key to find it)
 * name (name descrbing where the station is)
 * stationTypeId (referenc to the stationType of this station)
 */
export const stations = sqliteTable('stations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  stationTypeId: integer('stationTypeId')
  .references(() => stationTypes.id, {
    onUpdate:'cascade', 
    onDelete: 'set null',
  })
})

/**
 * ### stationRelations
 *  - many->many-relations to collectionTypes
 *  - many->one-relations to stationTypes  
 */
export const stationRelations = relations(stations, ({ one, many }) => ({
  stationType: one(stationTypes, {
    fields: [stations.stationTypeId],
    references: [stationTypes.id]
  }),
  collectionType: many(collectionTypeToStations),
}))

/**
 * # CollectionTypes
 * 
 * CollectionTypes describe which data are collected by a 
 * measurementCollection.
 * This is done by adding stations to the collectionType. Therefore
 * we have a many->many relationship between stations and collectionTypes.
 * 
 * data
 *  - id (primary key to find it)
 *  - name (a unique name)
 *  - description (desribe the purpose of this collectionType)
 */

export const collectionTypes = sqliteTable('collectionTypes', {
  id: integer('id')
    .primaryKey({ autoIncrement: true }),
  name: text('name')
    .notNull()
    .unique(),
  description: text('description')
})

/**
 * ## collectionTypeRelations 
 * as described above, we have a many->many relationship to stations 
 */
export const collectionTypeRelations = relations(collectionTypes, ({ many }) => ({
  collectionTypeToStations: many(collectionTypeToStations),
}))


/**
 * ## collectionTypeToStation
 * join-table for relations bettween collectionTypes and stations
 */
export const collectionTypeToStations = sqliteTable('collectionTypeToStation', 
  {
    collectionTypeId: integer('collectionTypeId')
    .notNull()
    .references(() => collectionTypes.id),
    stationId: integer('stationId')
    .notNull()
    .references(() => stations.id),
  },
  (table) => ({id: primaryKey(
    { 
      columns: [
        table.collectionTypeId, 
        table.stationId,
      ]
    })
  })
)

export const collectionTypeToStationRelations = relations(collectionTypeToStations, ({ one }) => ({
  collectionType: one(collectionTypes, {
    fields: [collectionTypeToStations.collectionTypeId],
    references: [collectionTypes.id]
  }),
  station: one(stations, {
    fields: [collectionTypeToStations.stationId],
    references: [stations.id],
  })
}))

/**
 * ## MeasurementCollections
 * MeasurmentCollections are holding measurements from different stations,
 * described by the related collectionType,
 *  at a given point in time
 */
export const measurementCollections = sqliteTable('measurementCollections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  createdAt: integer('createdAt', {mode: 'timestamp'}).default(sql`(UNIXEPOCH(CURRENT_TIMESTAMP))`),
  updatedAt: integer('updatedAt', {mode: 'timestamp'})
    .default(sql`(UNIXEPOCH(CURRENT_TIMESTAMP))`)
    .$onUpdate(() => {
      return new Date()
    }),
  collectionTypeId: integer('collectionTypeId')
    .references(() => collectionTypes.id, {
      onUpdate: 'cascade',
      onDelete: 'set null',
    })
})

/**
 * ## TempHumidMeasurements
 * TempHumidMeasurements collect data from stations of type
 * TemperatureHumidity
 */
export const tempHumidMeasurements = sqliteTable('tempHumidMeasurements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  temperature: integer('temperature').notNull(),
  humidity: integer('humidity').notNull(),
  stationId: integer('stationId')
    .references(() => stations.id, {
      onUpdate: 'cascade', 
      onDelete: 'set null'
    }),
  collectionId: integer('collectionId')
    .references(() => measurementCollections.id, {
      onUpdate: 'cascade',
      onDelete: 'set null',
    }),
})
