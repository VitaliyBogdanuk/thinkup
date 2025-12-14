import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { Project } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const collection = await getCollection<Project>(COLLECTIONS.PROJECTS);
    
    // Фільтрація за partnerId, якщо вказано
    const filter: any = {};
    if (query.partnerId) {
      filter.partnerId = query.partnerId;
    }
    if (query.status) {
      filter.status = query.status;
    }
    
    const projects = await collection.find(filter).toArray();
    return projects;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch projects',
    });
  }
});

