import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const dbName = process.env.MONGODB_DB_NAME || 'thinkup';

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function getCollection<T>(collectionName: string) {
  const database = await connectToDatabase();
  return database.collection<T>(collectionName);
}

// Колекції
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  BOARDS: 'boards',
  REVIEWS: 'partner_reviews',
  NOTIFICATIONS: 'notifications',
} as const;

