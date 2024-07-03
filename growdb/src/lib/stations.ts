import { stations as stationsTable } from '../db/schema'
import createTableApi from './helper/createTableApi'

const stations = createTableApi(stationsTable)

export default stations
