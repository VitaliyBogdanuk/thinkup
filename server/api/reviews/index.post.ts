import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { PartnerReview } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<PartnerReview>(event);
    const collection = await getCollection<PartnerReview>(COLLECTIONS.REVIEWS);
    
    // Перевіряємо, чи вже є відгук від цього партнера про цього студента в цьому проєкті
    const existingReview = await collection.findOne({
      partnerId: body.partnerId,
      studentId: body.studentId,
      projectId: body.projectId,
    });
    
    if (existingReview) {
      // Оновлюємо існуючий відгук
      const updateResult = await collection.updateOne(
        { _id: existingReview._id },
        { $set: body }
      );
      
      if (updateResult.modifiedCount > 0) {
        const review = await collection.findOne({ _id: existingReview._id });
        return review;
      }
    } else {
      // Створюємо новий відгук
      const result = await collection.insertOne(body);
      
      if (result.insertedId) {
        const review = await collection.findOne({ _id: result.insertedId });
        return review;
      }
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save review',
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save review',
    });
  }
});

