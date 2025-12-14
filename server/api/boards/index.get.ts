import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { Board } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const collection = await getCollection<Board>(COLLECTIONS.BOARDS);
    
    const filter: any = {};
    if (query.projectId) {
      filter.projectId = query.projectId;
    }
    
    const boards = await collection.find(filter).toArray();
    return boards;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch boards',
    });
  }
});

