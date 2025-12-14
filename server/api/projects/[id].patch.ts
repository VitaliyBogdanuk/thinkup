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

    const body = await readBody<Partial<Project>>(event);
    const collection = await getCollection<Project>(COLLECTIONS.PROJECTS);
    
    const updateResult = await collection.updateOne(
      { $or: [{ _id: new ObjectId(id) }, { id }] },
      { $set: body }
    );
    
    if (updateResult.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found',
      });
    }
    
    const project = await collection.findOne({ $or: [{ _id: new ObjectId(id) }, { id }] });
    return project;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update project',
    });
  }
});

