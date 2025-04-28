import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToDatabase() {
  try {
    // No need to check isConnected() anymore
    if (!client.isConnected) {
      await client.connect();
    }
    const db = client.db();
    return { db, client };
  } catch (error) {
    console.error("Database connection error: ", error);
    throw new Error("Failed to connect to the database");
  }
}
