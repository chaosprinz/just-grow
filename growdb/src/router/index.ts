import express, { Router } from 'express'
import createRouterFromTableApi from '../lib/helper/createRouterFromTableApi'
import collectionTypes from '../lib/collectionType'


const router: Router = express.Router()

router.use('/collectionTypes', createRouterFromTableApi(collectionTypes))

export default router
