import { connect, Cluster, SearchRequest, VectorSearch, VectorQuery } from 'couchbase'
import dotenv from 'dotenv'
dotenv.config()

const {
  COUCHBASE_CONNECTION_STRING,
  COUCHBASE_USERNAME,
  COUCHBASE_PASSWORD,
  COUCHBASE_BUCKET_NAME,
  COUCHBASE_SEARCH_INDEX_NAME
} = process.env

let cluster, bucket

async function initCouchbase() {
  if (!cluster) {
    cluster = await connect(COUCHBASE_CONNECTION_STRING, {
      username: COUCHBASE_USERNAME,
      password: COUCHBASE_PASSWORD,
      configProfile: 'wanDevelopment',
    })
    bucket = cluster.bucket(COUCHBASE_BUCKET_NAME)

    console.log('Connected to Couchbase')
  }
  return { cluster, bucket }
}

export async function getRelevantDocumentIds(embedding) {
  const { cluster } = await initCouchbase()
  const scope = cluster.bucket(COUCHBASE_BUCKET_NAME).scope('_default');
  
  let request = SearchRequest.create(
    VectorSearch.fromVectorQuery(
        VectorQuery.create('_default.embedding', embedding).numCandidates(3)
    )
  );

  const result = await scope.search(COUCHBASE_SEARCH_INDEX_NAME, request);

  console.log(`Result: ${JSON.stringify(result)}`);

  return result.rows.map(row => {
    return {
        id: row.id,
        score: row.score
    };
  });
}

export async function getRelevantDocuments(embedding) {
    const { cluster } = await initCouchbase();
    const bucket = cluster.bucket(COUCHBASE_BUCKET_NAME);
    const collection = bucket.defaultCollection();

    const storedEmbeddings = await getRelevantDocumentIds(embedding);
  
    const results = await Promise.all(
      storedEmbeddings.map(async ({ id, score }) => {
        try {
          const result = await collection.get(id);
          const content = result.content;
          
          // Remove embedding from content
          if (content && content._default && content._default.embedding) {
            delete content._default.embedding;
          }
  
          return {
            content: content,
            score: score 
          };
        } catch (err) {
          console.error(`Error fetching document with ID ${id}:`, err);
          return null;
        }
      })
    );
  
    return results.filter(doc => doc !== null); 
}
