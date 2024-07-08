import { measurementCollections as measurementCollectionsTable } from '../db/schema'
import createTableApi from './helper/createTableApi'

export interface MeasurementCollectionData {
  name: string
  description?: string
}

const measurementCollections = createTableApi(measurementCollectionsTable)

export default measurementCollections
