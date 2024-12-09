import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import queryRoute from './routes/query.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/query', queryRoute)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`)
})
