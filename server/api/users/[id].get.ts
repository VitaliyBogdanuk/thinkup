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

    const collection = await getCollection<User>(COLLECTIONS.USERS);
    
    // Спробуємо знайти за ObjectId або за id (якщо це string)
    let user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      user = await collection.findOne({ id });
    }
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }
    
    return user;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user',
    });
  }
});

