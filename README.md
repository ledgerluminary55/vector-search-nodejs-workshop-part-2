# Vector Search Workshop with Couchbase and Node.js - Part 2

![Couchbase Capella](https://img.shields.io/badge/Couchbase_Capella-Enabled-red)
[![License: MIT](https://cdn.prod.website-files.com/5e0f1144930a8bc8aace526c/65dd9eb5aaca434fac4f1c34_License-MIT-blue.svg)](/LICENSE)

In this second part of the workshop, we will build upon the data and vector embeddings generated in [Part 1](https://github.com/hummusonrails/vector-search-nodejs-workshop) and integrate them into a Retrieval Augmented Generation (RAG) application. We’ll use a React frontend and a Node.js backend that leverages OpenAI for embeddings and Couchbase Capella for vector similarity searches.

## Prerequisites

- Completion of [Part 1 of this workshop](https://github.com/hummusonrails/vector-search-nodejs-workshop), where you have:
- A Couchbase Capella cluster with a bucket containing documents and their vector embeddings.
- A functioning vector search index in Capella.
- An OpenAI API key.
- A working Node.js environment.

## Workshop Outline

1. [Set Up the Frontend (React)](#set-up-the-frontend-react)
2. [Set Up the Backend (Node.js)](#set-up-the-backend-nodejs)
3. [Integrate Capella Vector Search](#integrate-capella-vector-search)
4. [Integrate OpenAI for RAG](#integrate-openai-for-rag)
5. [Run and Test the Application](#run-and-test-the-application)

## Set Up the Frontend (React)

In this step, you’ll have a pre-configured React frontend that provides a UI for users to query your RAG application. The frontend will send user queries to your backend’s `/api/query` endpoint.

### Steps

1. Navigate to the `frontend` directory.
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start the development server:
    ```bash
    npm run dev
    ```
4. Open your browser and navigate to `http://localhost:3000`. You should see the RAG application UI.

## Set Up the Backend (Node.js)

Your backend will:

* Accept user queries from the frontend.
* Transform the queries into vector embeddings using OpenAI.
* Search for similar vectors in your Capella cluster.
* Augment the user query with the retrieved documents and request a response from OpenAI.
* Return the response to the frontend.

### Steps

1. Navigate to the `backend` directory.
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start the backend:
    ```bash
    node server.js
    ```

## Integrate Capella Vector Search

Your backend will use the Couchbase Node.js SDK to connect to Capella and execute vector similarity queries against the index created in Part 1.

Verify you have your Couchbase Capella connection config defined in `.env` file in the `backend` directory:

```env
COUCHBASE_CONNECTION_STRING=your-connection-string
COUCHBASE_USERNAME=your-username
COUCHBASE_PASSWORD=your-password
COUCHBASE_SEARCH_INDEX_NAME=your-index-name
COUCHBASE_BUCKET_NAME=your-bucket-name
```

## Integrate OpenAI for RAG

To transform user queries into embeddings and generate responses using retrieved context from Capella, you’ll integrate OpenAI’s API.

Verify you have your OpenAI API key defined in `.env` file in the `backend` directory:

```env
OPENAI_API_KEY=your-api-key
```

## Run and Test the Application

Once everything is connected, you can run both the frontend and backend together:

1. Ensure the backend (node server.js in backend) and frontend (npm run dev in frontend) servers are running.
2. Visit the frontend URL in your browser.
3. Enter a query and submit it.
4. Frontend displays the response.
