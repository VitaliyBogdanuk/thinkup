import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { User } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const collection = await getCollection<User>(COLLECTIONS.USERS);
    const users = await collection.find({}).toArray();
    return users;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users',
    });
  }
});

