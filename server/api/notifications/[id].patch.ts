import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { BaseNotification } from '~/types';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody<Partial<BaseNotification>>(event);
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Notification ID is required',
      });
    }

    const collection = await getCollection<BaseNotification>(COLLECTIONS.NOTIFICATIONS);
    
    // Знаходимо сповіщення за id (UUID) або _id (ObjectId)
    let notification = await collection.findOne({ id });
    
    if (!notification && ObjectId.isValid(id) && id.length === 24) {
      notification = await collection.findOne({ _id: new ObjectId(id) });
    }
    
    if (!notification) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Notification not found',
      });
    }
    
    const updateData: any = {};
    if (body.read !== undefined) {
      updateData.read = body.read;
    }
    if (body.title !== undefined) {
      updateData.title = body.title;
    }
    if (body.message !== undefined) {
      updateData.message = body.message;
    }
    
    const updateResult = await collection.updateOne(
      { id: notification.id },
      { $set: updateData }
    );
    
    if (updateResult.modifiedCount === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update notification',
      });
    }
    
    const updated = await collection.findOne({ id: notification.id });
    return updated;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update notification',
    });
  }
});

