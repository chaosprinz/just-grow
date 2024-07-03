import express, { Router } from 'express'
import createRouterFromTableApi from '../lib/helper/createRouterFromTableApi'
import collectionTypes from '../lib/collectionType'
import measurementCollections from '../lib/measurementCollections'
import stations from '../lib/stations'
import stationTypes from '../lib/stationTypes'
import tempHumidMeasurements from '../lib/tempHumidMeasurements'

const router: Router = express.Router()

router.use('/collectionTypes', createRouterFromTableApi(collectionTypes))
router.use('/measurementCollections', createRouterFromTableApi(measurementCollections))
router.use('/stations', createRouterFromTableApi(stations))
router.use('/stationTypes', createRouterFromTableApi(stationTypes))
router.use('/tempHumidMeasurements', createRouterFromTableApi(tempHumidMeasurements))

export default router
