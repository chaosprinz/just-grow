import express, { Application, Request, Response } from 'express'
import router from './router'

const app: Application = express()

app.use(express.json())

app.get('/', (req: Request, res: Response): void => {
  res.json({ message: 'growdb running'})
})

app.use(router)

export default app
