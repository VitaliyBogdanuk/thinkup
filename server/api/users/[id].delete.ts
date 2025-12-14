import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import { isProtectedUser, isDemoId } from '~/server/utils/protectedData';
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
    
    // Знаходимо користувача
    let user = await collection.findOne({ id });
    
    // Якщо не знайдено за id, спробуємо за _id (ObjectId)
    if (!user) {
      try {
        if (ObjectId.isValid(id) && id.length === 24) {
          user = await collection.findOne({ _id: new ObjectId(id) });
        }
      } catch (error) {
        console.warn('Failed to search by ObjectId:', error);
      }
    }
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: `User not found with id: ${id}`,
      });
    }
    
    // Перевіряємо, чи це захищені демо-дані
    const userIdToCheck = user.id || id;
    if (isProtectedUser(userIdToCheck) || isDemoId(userIdToCheck)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot delete demo data. This user is protected.',
      });
    }
    
    // Видаляємо користувача
    let deleteResult;
    if (ObjectId.isValid(id) && id.length === 24) {
      deleteResult = await collection.deleteOne({
        $or: [{ id }, { _id: new ObjectId(id) }]
      });
    } else {
      deleteResult = await collection.deleteOne({ id });
    }
    
    if (deleteResult.deletedCount === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete user',
      });
    }
    
    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete user',
    });
  }
});

