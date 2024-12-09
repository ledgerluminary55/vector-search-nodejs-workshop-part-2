import dotenv from 'dotenv'
import openai from 'openai'
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_EMBEDDING_MODEL = 'text-embedding-ada-002'
const OPENAI_COMPLETION_MODEL = 'gpt-4o-mini'

const openaiclient = new openai.OpenAI({ apiKey: OPENAI_API_KEY });

export async function getEmbedding(query) {
  const response = await openaiclient.embeddings.create({
    model: OPENAI_EMBEDDING_MODEL,
    input: query,
  });
  
  return response.data[0].embedding;
}

export async function getCompletion(prompt) {
  const completion = await openaiclient.chat.completions.create({
    model: OPENAI_COMPLETION_MODEL,
    messages: [
      { role: 'system', content: 'You are an expert on the Star Wars universe. Return the response in plain text, do not use markdown. Answer in an informal and casual conversational manner.' },
      { role: 'user', content: prompt },
    ],
  });

  return completion.choices[0].message.content;
}

export async function getCompletionStream(prompt) {
  const stream = await openaiclient.chat.completions.create({
    model: OPENAI_COMPLETION_MODEL,
    messages: [
      { role: 'system', content: 'You are an expert on the Star Wars universe. Return the response in plain text, do not use markdown. Answer in an informal and casual conversational manner.' },
      { role: 'user', content: prompt },
    ],
    stream: true,
  });

  console.log(stream);

  return stream; 
}
