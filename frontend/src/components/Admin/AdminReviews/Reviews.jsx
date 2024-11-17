import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'reactstrap';
import reviewService from '../../../services/reviewService';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getAllReviews();
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(id);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-reviews p-4">
      <h2>Reviews Management</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Tour</th>
            <th>User</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              <td>{review.tourId.name}</td>
              <td>{review.userId.username}</td>
              <td>
                <Badge color="warning">{review.rating} ★</Badge>
              </td>
              <td>{review.comment}</td>
              <td>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleDeleteReview(review._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Reviews; 