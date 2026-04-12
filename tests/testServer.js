import express from 'express'
import bodyParser from 'body-parser'
import { postExtractRequirement, postGenerateFirstResponse } from '../server/controllers/assistantController.js'

const app = express()
app.use(bodyParser.json())

app.post('/api/assistant/extract-requirement', postExtractRequirement)
app.post('/api/assistant/generate-first-response', postGenerateFirstResponse)

export default app
