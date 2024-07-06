import { stationTypes as stationTypesTable } from '../db/schema'
import createTableApi from './helper/createTableApi'


const _stationTypes = createTableApi(stationTypesTable)

const stationTypes = {
  ..._stationTypes,
}

export default stationTypes
