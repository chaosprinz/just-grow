import { tempHumidMeasurements as tempHumidMeasurementsTable } from '../db/schema'
import createTableApi from './helper/createTableApi'

const tempHumidMeasurements = createTableApi(tempHumidMeasurementsTable)

export default tempHumidMeasurements
