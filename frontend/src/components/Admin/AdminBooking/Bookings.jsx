import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'reactstrap';
import { BASE_URL } from '../../../utils/config';
import bookingService from '../../../services/bookingService';
const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getAllBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.message.includes('authentication')) {
        window.location.href = '/login';
      }
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await fetch(`${BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ tourStatus: newStatus })
      });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-bookings p-4">
      <h2>Bookings Management</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Tour</th>
            <th>Date</th>
            <th>Status</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.customerName}</td>
              <td>{booking.tourName}</td>
              <td>{new Date(booking.tourDate).toLocaleDateString()}</td>
              <td>
                <Badge color={
                  booking.tourStatus === 'Paid' ? 'warning' :
                  booking.tourStatus === 'Completed' ? 'success' : 'danger'
                }>
                  {booking.tourStatus}
                </Badge>
              </td>
              <td>${booking.totalPrice}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => handleStatusUpdate(booking._id, 'Completed')}
                    disabled={booking.tourStatus === 'Completed'}
                  >
                    Complete
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleStatusUpdate(booking._id, 'Canceled')}
                    disabled={booking.tourStatus === 'Canceled'}
                  >
                    Cancel
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminBookings; 