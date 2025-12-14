import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { Board } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Board>(event);
    const collection = await getCollection<Board>(COLLECTIONS.BOARDS);
    
    // Перевіряємо, чи вже існує дошка з таким id
    if (body.id) {
      const existingBoard = await collection.findOne({ id: body.id });
      if (existingBoard) {
        // Якщо дошка існує, повертаємо її замість створення дубліката
        return existingBoard;
      }
    }
    
    const result = await collection.insertOne(body);
    
    if (result.insertedId) {
      const board = await collection.findOne({ _id: result.insertedId });
      return board;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create board',
    });
  } catch (error: any) {
    // Якщо помилка через дублікат (MongoDB duplicate key error)
    if (error.code === 11000) {
      // Спробуємо знайти існуючий запис
      const collection = await getCollection<Board>(COLLECTIONS.BOARDS);
      if (body.id) {
        const existingBoard = await collection.findOne({ id: body.id });
        if (existingBoard) {
          return existingBoard;
        }
      }
    }
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create board',
    });
  }
});

