import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { User } from '~/types';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      });
    }

    const body = await readBody<Partial<User>>(event);
    const collection = await getCollection<User>(COLLECTIONS.USERS);
    
    // Оновлюємо за ObjectId або за id
    const updateResult = await collection.updateOne(
      { $or: [{ _id: new ObjectId(id) }, { id }] },
      { $set: body }
    );
    
    if (updateResult.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }
    
    const user = await collection.findOne({ $or: [{ _id: new ObjectId(id) }, { id }] });
    return user;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update user',
    });
  }
});

