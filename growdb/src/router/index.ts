import express, { Router } from 'express'
import collectionTypesRouter from './collectionTypes'

const router: Router = express.Router()

router.use('/collectionTypes', collectionTypesRouter)

export default router
