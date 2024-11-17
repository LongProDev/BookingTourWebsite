import { BASE_URL } from '../utils/config';

const reviewService = {
  getAllReviews: async () => {
    const response = await fetch(`${BASE_URL}/reviews`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return await response.json();
  },

  deleteReview: async (id) => {
    const response = await fetch(`${BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return await response.json();
  }
};

export default reviewService; 