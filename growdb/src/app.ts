import express, { Application, Request, Response } from 'express'

const app: Application = express()

app.get('/', (req: Request, res: Response): void => {
  res.json({ message: 'Hey'})
})

export default app