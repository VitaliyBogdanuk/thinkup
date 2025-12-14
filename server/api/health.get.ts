import { connectToDatabase } from '~/server/utils/mongodb';

export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const collections = await db.listCollections().toArray();
    
    return {
      status: 'connected',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
});

