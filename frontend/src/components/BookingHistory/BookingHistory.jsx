import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge } from 'reactstrap';
import bookingService from '../../services/bookingService';
import authService from '../../services/authService';
import './bookingHistory.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await bookingService.getBookingsByEmail(currentUser.email);
      setBookings(response.data.sort((a, b) => 
        new Date(b.bookingDate) - new Date(a.bookingDate)
      ));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Canceled': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <section className="booking-history">
      <Container>
        <Row>
          <Col>
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Tour Name</th>
                    <th>Booking Date</th>
                    <th>Departure</th>
                    <th>Return</th>
                    <th>Passengers</th>
                    <th>Total Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.tourName}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td>
                        {new Date(booking.departureDate).toLocaleDateString()}
                        <br />
                        {booking.departureTime}
                      </td>
                      <td>
                        {new Date(booking.returnDate).toLocaleDateString()}
                        <br />
                        {booking.returnTime}
                      </td>
                      <td>
                        Adults: {booking.numberOfAdults}
                        <br />
                        Children: {booking.numberOfChildren}
                      </td>
                      <td>${booking.totalPrice}</td>
                      <td>
                        <Badge color={getStatusBadgeColor(booking.tourStatus)}>
                          {booking.tourStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BookingHistory; 