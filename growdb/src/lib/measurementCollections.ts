import { measurementCollections as measurementCollectionsTable } from '../db/schema'
import createTableApi from './helper/createTableApi'

const measurementCollections = createTableApi(measurementCollectionsTable)

export default measurementCollections
