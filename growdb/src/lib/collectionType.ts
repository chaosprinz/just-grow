import { collectionTypes as collectionTypesTable } from '../db/schema'
import createTableApi from './helper/createTableApi'

const collectionTypes = createTableApi(collectionTypesTable)

export default collectionTypes
