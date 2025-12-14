import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import { isProtectedBoard, isDemoId } from '~/server/utils/protectedData';
import type { Board } from '~/types';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Board ID is required',
      });
    }

    const collection = await getCollection<Board>(COLLECTIONS.BOARDS);
    
    // Знаходимо дошку
    let board = await collection.findOne({ id });
    if (!board && ObjectId.isValid(id) && id.length === 24) {
      try {
        board = await collection.findOne({ _id: new ObjectId(id) });
      } catch (error) {
        console.warn('Failed to search by ObjectId:', error);
      }
    }
    
    if (!board) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Board not found',
      });
    }
    
    // Перевіряємо, чи це захищені демо-дані
    const boardIdToCheck = board.id || id;
    if (isProtectedBoard(boardIdToCheck) || isDemoId(boardIdToCheck)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot delete demo data. This board is protected.',
      });
    }
    
    // Видаляємо дошку
    let deleteResult;
    if (ObjectId.isValid(id) && id.length === 24) {
      try {
        deleteResult = await collection.deleteOne({
          $or: [{ id }, { _id: new ObjectId(id) }]
        });
      } catch (error) {
        console.warn('Failed to delete by ObjectId, trying by id only:', error);
        deleteResult = await collection.deleteOne({ id });
      }
    } else {
      deleteResult = await collection.deleteOne({ id });
    }
    
    if (deleteResult.deletedCount === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete board',
      });
    }
    
    return {
      success: true,
      message: 'Board deleted successfully',
    };
  } catch (error: any) {
    console.error('Error deleting board:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete board',
    });
  }
});

