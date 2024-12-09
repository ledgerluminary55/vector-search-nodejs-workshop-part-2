import { Router } from 'express'
import { getEmbedding, getCompletionStream } from '../services/openaiService.js'
import { getRelevantDocuments } from '../services/couchbaseService.js'

const router = Router()

router.post('/', async (req, res) => {
  const { q } = req.body

  if (!q || q.trim() === '') {
    return res.status(400).json({ error: 'Query is required.' })
  }

  try {
    const embedding = await getEmbedding(q)

    const documents = await getRelevantDocuments(embedding)

    // Step 3: Construct the prompt
    const prompt = `
      You are an expert on the Star Wars universe.
      Given the user query and the following relevant documents, provide a helpful and accurate answer.
      Documents:
      ${documents.map((doc) => JSON.stringify(doc)).join('\n')}
      User Query: ${q}
    `

    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')

    // Step 4: Get a streaming completion
    const stream = await getCompletionStream(prompt)

    // Iterate over the streamed chunks and send them to the client as they arrive
    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content
      if (token) {
        res.write(token)
      }
    }

    // When the stream ends, end the response
    res.end()
  } catch (error) {
    console.error(error)
    if (!res.headersSent) {
      res.status(500).json({ error: 'An error occurred while processing your request.' })
    } else {
      res.end()
    }
  }
})

export default router
