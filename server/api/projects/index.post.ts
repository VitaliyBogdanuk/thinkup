import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { Project } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Project>(event);
    const collection = await getCollection<Project>(COLLECTIONS.PROJECTS);
    
    // Перевіряємо, чи вже існує проєкт з таким id
    if (body.id) {
      const existingProject = await collection.findOne({ id: body.id });
      if (existingProject) {
        // Якщо проєкт існує, повертаємо його замість створення дубліката
        return existingProject;
      }
    }
    
    const result = await collection.insertOne(body);
    
    if (result.insertedId) {
      const project = await collection.findOne({ _id: result.insertedId });
      return project;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create project',
    });
  } catch (error: any) {
    // Якщо помилка через дублікат (MongoDB duplicate key error)
    if (error.code === 11000) {
      // Спробуємо знайти існуючий запис
      const collection = await getCollection<Project>(COLLECTIONS.PROJECTS);
      if (body.id) {
        const existingProject = await collection.findOne({ id: body.id });
        if (existingProject) {
          return existingProject;
        }
      }
    }
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create project',
    });
  }
});

