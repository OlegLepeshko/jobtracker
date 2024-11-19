import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017/my-next-app'; 
let client: MongoClient;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  const db = client.db('my-next-app');
  return { db };
}
