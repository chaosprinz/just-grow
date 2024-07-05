import express, { Router } from 'express'

const createRouterFromTableApi = (tableApi: any): Router => {
  const router = express.Router()

    
  router.get('/', async (req, res) => {
    const result = await tableApi.getMany()
    
    res.json(result)
  })

  router.get('/:id', async (req, res) => {
    const result = await tableApi.getOne(parseInt(req.params.id))
    if(!result) res
      .status(404)
      .json({error: 'Not found'})
    res.json(result)
  })

  router.post('/', (req, res) => {
    const result = tableApi.createOne(req.body)
    res.json(result)
  })

  router.put('/:id', (req, res) => {
    const result = tableApi
      .updateOne(
        parseInt(req.params.id), 
        req.body
      )
    if(!result) res
      .status(404)
      .json({error: 'Not found'})
    res.json(result)
  })

  router.delete('/:id', (req, res) => {
    const result = tableApi
      .deleteOne(parseInt(req.params.id))
    if(!result) res
      .status(404)
      .json({error: 'Not found'})
    res.json(result)
  })

  return router
}

export default createRouterFromTableApi
