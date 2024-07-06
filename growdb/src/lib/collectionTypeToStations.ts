import { collectionTypeToStations as collectionTypeToStationTable } from '../db/schema'
import createTableApi from './helper/createTableApi'

const _collectionTypeToStations = createTableApi(collectionTypeToStationTable)

const collectionTypeToStations = {
  ..._collectionTypeToStations
}

export default collectionTypeToStations