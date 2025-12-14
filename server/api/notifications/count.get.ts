import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { BaseNotification } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const userId = query.userId as string;
    const role = query.role as string;

    if (!userId || !role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'userId and role are required',
      });
    }

    const collection = await getCollection<BaseNotification>(COLLECTIONS.NOTIFICATIONS);
    
    const count = await collection.countDocuments({
      userId,
      role,
      read: false,
    });
    
    return { count };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to count notifications',
    });
  }
});

