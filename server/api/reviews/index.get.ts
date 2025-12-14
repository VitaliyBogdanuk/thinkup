import { getCollection, COLLECTIONS } from '~/server/utils/mongodb';
import type { PartnerReview } from '~/types';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const collection = await getCollection<PartnerReview>(COLLECTIONS.REVIEWS);
    
    const filter: any = {};
    if (query.studentId) {
      filter.studentId = query.studentId;
    }
    if (query.partnerId) {
      filter.partnerId = query.partnerId;
    }
    if (query.projectId) {
      filter.projectId = query.projectId;
    }
    
    const reviews = await collection.find(filter).toArray();
    return reviews;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch reviews',
    });
  }
});

