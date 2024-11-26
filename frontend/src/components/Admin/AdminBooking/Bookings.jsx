import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'reactstrap';
import bookingService from '../../../services/bookingService';
import './bookings.css';

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
      await bookingService.updateBooking(id, { tourStatus: newStatus });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingService.deleteBooking(id);
        fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-bookings p-4">
      <h2>Bookings Management</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Tour Name</th>
            <th>Passengers</th>
            <th>Booking Time</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.customerName}</td>
              <td>{booking.customerEmail}</td>
              <td>{booking.customerPhone}</td>
              <td>{booking.tourName}</td>
              <td>
                Adults: {booking.numberOfAdults}<br/>
                Children: {booking.numberOfChildren}
              </td>
              <td>{new Date(booking.bookingDate).toLocaleString()}</td>
              <td>${booking.totalPrice}</td>
              <td>
                <Badge color={
                  booking.tourStatus === 'Paid' ? 'primary' :
                  booking.tourStatus === 'Completed' ? 'success' : 'warning'
                }>
                  {booking.tourStatus}
                </Badge>
              </td>
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
                    color="warning"
                    size="sm"
                    onClick={() => handleStatusUpdate(booking._id, 'Canceled')}
                    disabled={booking.tourStatus === 'Canceled'}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteBooking(booking._id)}
                  >
                    Delete
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