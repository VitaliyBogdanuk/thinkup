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

    const body = await readBody<Partial<Board>>(event);
    const collection = await getCollection<Board>(COLLECTIONS.BOARDS);
    
    const updateResult = await collection.updateOne(
      { $or: [{ _id: new ObjectId(id) }, { id }] },
      { $set: body }
    );
    
    if (updateResult.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Board not found',
      });
    }
    
    const board = await collection.findOne({ $or: [{ _id: new ObjectId(id) }, { id }] });
    return board;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update board',
    });
  }
});

