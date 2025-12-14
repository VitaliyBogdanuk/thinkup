import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { BaseNotification } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const userId = query.userId as string;
    const role = query.role as string;
    const read = query.read as string | undefined;

    if (!userId || !role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'userId and role are required',
      });
    }

    const collection = await getCollection<BaseNotification>(COLLECTIONS.NOTIFICATIONS);
    
    const filter: any = { userId, role };
    if (read !== undefined) {
      filter.read = read === 'true';
    }
    
    const notifications = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    
    return notifications;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch notifications',
    });
  }
});

