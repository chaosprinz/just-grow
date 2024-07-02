import express, { Router } from 'express'
import collectionTypes from '../lib/collectionType'
import { json } from 'stream/consumers'

const collectionTypesRouter: Router = express.Router()

collectionTypesRouter.get('/', (req, res) => {
  const result = collectionTypes.getMany()
  res.json(result)
})

collectionTypesRouter.get('/:id', (req, res) => {
  const result = collectionTypes.getOne(parseInt(req.params.id))
  if(!result) res
    .status(404)
    .json({error: 'Not found'})
  res.json(result)
})

collectionTypesRouter.post('/', (req, res) => {
  const result = collectionTypes.createOne(req.body)
  res.json(result)
})

collectionTypesRouter.put('/:id', (req, res) => {
  const result = collectionTypes
    .updateOne(
      parseInt(req.params.id), 
      req.body
    )
  if(!result) res
    .status(404)
    .json({error: 'Not found'})
  res.json(result)
})

collectionTypesRouter.delete('/:id', (req, res) => {
  const result = collectionTypes
    .deleteOne(parseInt(req.params.id))
  if(!result) res
    .status(404)
    .json({error: 'Not found'})
  res.json(result)
})

export default collectionTypesRouter
