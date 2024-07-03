import express, { Router } from 'express'
import createRouterFromTableApi from '../lib/helper/createRouterFromTableApi'
import collectionTypes from '../lib/collectionType'
import measurementCollections from '../lib/measurementCollections'


const router: Router = express.Router()

router.use('/collectionTypes', createRouterFromTableApi(collectionTypes))
router.use('/measurementCollections', createRouterFromTableApi(measurementCollections))

export default router
