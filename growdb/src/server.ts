import app from './app'

const PORT: String = process.env.PORT ?  process.env.PORT : '3000'

app.listen(PORT, (): void => console.log(`server listening on ${PORT}`))
