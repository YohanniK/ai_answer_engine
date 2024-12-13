import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "YOUR_PINCONE_API_KEY",
});

const model = "multilingual-e5-large";

export async function storeEmbeddings(
  indexName: string,
  id: string,
  embedding: number[],
  metadata: RecordMetadata | undefined
) {
  const index = pc.Index(indexName);
  await index.upsert([{ id, values: embedding, metadata }]);
}

export async function queryEmbeddings(
  indexName: string,
  queryVector: number[],
  topK = 5
) {
  const index = pc.Index(indexName);
  return index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });
}

export async function generateEmbeddings(query: string) {
  const embeddings = await pc.inference.embed(model, [query], {
    inputType: "query",
  });

  return embeddings[0].values;
}
