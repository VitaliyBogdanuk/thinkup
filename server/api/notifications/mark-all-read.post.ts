import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { BaseNotification } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ userId: string; role: string }>(event);
    
    if (!body.userId || !body.role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'userId and role are required',
      });
    }

    const collection = await getCollection<BaseNotification>(COLLECTIONS.NOTIFICATIONS);
    
    const result = await collection.updateMany(
      {
        userId: body.userId,
        role: body.role,
        read: false,
      },
      {
        $set: { read: true },
      }
    );
    
    return {
      success: true,
      modifiedCount: result.modifiedCount,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to mark notifications as read',
    });
  }
});

