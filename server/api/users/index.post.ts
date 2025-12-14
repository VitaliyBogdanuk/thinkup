import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { User } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<User>(event);
    const collection = await getCollection<User>(COLLECTIONS.USERS);
    
    // Перевіряємо, чи вже існує користувач з таким id
    if (body.id) {
      const existingUser = await collection.findOne({ id: body.id });
      if (existingUser) {
        // Якщо користувач існує, повертаємо його замість створення дубліката
        return existingUser;
      }
    }
    
    // Перевіряємо, чи вже існує користувач з таким email
    if (body.email) {
      const existingUserByEmail = await collection.findOne({ email: body.email });
      if (existingUserByEmail) {
        // Якщо користувач існує, повертаємо його замість створення дубліката
        return existingUserByEmail;
      }
    }
    
    const result = await collection.insertOne(body);
    
    if (result.insertedId) {
      const user = await collection.findOne({ _id: result.insertedId });
      return user;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user',
    });
  } catch (error: any) {
    // Якщо помилка через дублікат (MongoDB duplicate key error)
    if (error.code === 11000) {
      // Спробуємо знайти існуючий запис за id або email
      const collection = await getCollection<User>(COLLECTIONS.USERS);
      if (body.id) {
        const existingUser = await collection.findOne({ id: body.id });
        if (existingUser) {
          return existingUser;
        }
      }
      if (body.email) {
        const existingUser = await collection.findOne({ email: body.email });
        if (existingUser) {
          return existingUser;
        }
      }
    }
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user',
    });
  }
});

