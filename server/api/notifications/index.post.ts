import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { BaseNotification } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<BaseNotification & { userId: string; role: string }>(event);
    const collection = await getCollection<BaseNotification & { userId: string; role: string }>(COLLECTIONS.NOTIFICATIONS);
    
    // Перевіряємо, чи вже існує сповіщення з таким id
    if (body.id) {
      const existingNotification = await collection.findOne({ id: body.id });
      if (existingNotification) {
        return existingNotification;
      }
    }
    
    const notification = {
      ...body,
      createdAt: body.createdAt || new Date(),
    };
    
    const result = await collection.insertOne(notification);
    
    if (result.insertedId) {
      const created = await collection.findOne({ _id: result.insertedId });
      return created;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create notification',
    });
  } catch (error: any) {
    if (error.code === 11000) {
      const body = await readBody<BaseNotification & { userId: string; role: string }>(event);
      const collection = await getCollection<BaseNotification & { userId: string; role: string }>(COLLECTIONS.NOTIFICATIONS);
      const existingNotification = await collection.findOne({ id: body.id });
      if (existingNotification) {
        return existingNotification;
      }
    }
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create notification',
    });
  }
});

