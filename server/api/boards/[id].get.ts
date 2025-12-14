import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
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
    
    let board = await collection.findOne({ _id: new ObjectId(id) });
    if (!board) {
      board = await collection.findOne({ id });
    }
    
    if (!board) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Board not found',
      });
    }
    
    return board;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch board',
    });
  }
});

