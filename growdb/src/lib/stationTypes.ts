import { stationTypes as stationTypesTable } from '../db/schema'
import createTableApi from './helper/createTableApi'

const stationTypes = createTableApi(stationTypesTable)

export default stationTypes
