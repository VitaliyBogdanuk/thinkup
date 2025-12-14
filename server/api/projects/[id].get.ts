import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { Project } from '~/types';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project ID is required',
      });
    }

    const collection = await getCollection<Project>(COLLECTIONS.PROJECTS);
    
    // Спробуємо знайти проєкт за id (UUID)
    let project = await collection.findOne({ id });
    
    // Якщо не знайдено за id, спробуємо за _id (ObjectId)
    if (!project) {
      try {
        // Перевіряємо, чи id є валідним ObjectId
        if (ObjectId.isValid(id) && id.length === 24) {
          project = await collection.findOne({ _id: new ObjectId(id) });
        }
      } catch (error) {
        // Ігноруємо помилку, якщо id не є валідним ObjectId
        console.warn('Failed to search by ObjectId:', error);
      }
    }
    
    if (!project) {
      throw createError({
        statusCode: 404,
        statusMessage: `Project not found with id: ${id}`,
      });
    }
    
    return project;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch project',
    });
  }
});

