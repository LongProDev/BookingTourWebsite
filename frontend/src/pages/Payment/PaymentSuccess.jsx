import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import bookingService from '../../services/bookingService';
import './paymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const updateBookingStatus = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const bookingId = searchParams.get('booking_id');

        if (!bookingId) {
          throw new Error('Booking information not found');
        }

        // Update booking status to Paid
        const response = await bookingService.updateBookingPayment(bookingId, 'Completed');
        if (response.success) {
          setBooking(response.data);

        }
      } catch (error) {
        console.error('Error updating booking:', error);
        navigate('/booking-failed');
      } finally {
        setLoading(false);
      }
    };

    updateBookingStatus();
  }, [location, navigate]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <section className="payment-success">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="success-card p-4 text-center">
              <FaCheckCircle className="success-icon mb-4" />
              <h2>Payment Successful!</h2>
              <p className="lead mb-4">Your tour booking has been confirmed.</p>

              <div className="booking-details text-start">
                <h4>Booking Details</h4>
                <p><strong>Booking ID:</strong> {booking?._id}</p>
                <p><strong>Tour:</strong> {booking?.tourName}</p>
                
                <p><strong>Total Amount Paid:</strong> ${booking?.totalPrice}</p>
                <p><strong>Status:</strong> <span className="text-success">Paid</span></p>
              </div>

              <div className="mt-4">
                <Button color="primary" onClick={() => navigate('/my-bookings')}>
                  View My Bookings
                </Button>
                <Button color="link" onClick={() => navigate('/tours')}>
                  Book Another Tour
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PaymentSuccess; 