import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'reactstrap';
import { toast } from 'react-hot-toast';
import './reviews.css';
import { BASE_URL } from '../../../utils/config';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/reviews`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch reviews');
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Review deleted successfully');
        setReviews(reviews.filter(review => review._id !== reviewId));
      } else {
        toast.error('Failed to delete review');
      }
    } catch (error) {
      toast.error('Error deleting review');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-reviews p-5">
      <h2>Review Management</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>No.</th>
            <th>User</th>
            <th>Tour</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review._id}>
              <td>{index + 1}</td>
              <td>{review.userId?.username || 'Unknown User'}</td>
              <td>{review.tourId?.name || 'Unknown Tour'}</td>
              <td>
                <Badge color="info">{review.rating} ★</Badge>
              </td>
              <td className="comment-cell">{review.comment}</td>
              <td>{new Date(review.createdAt).toLocaleDateString()}</td>
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

export default AdminReviews; 