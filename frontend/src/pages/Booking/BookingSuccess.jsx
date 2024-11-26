import React from 'react';
import { Container, Row, Col, Card, Button } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './bookingSuccess.css';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || 'Your booking has been confirmed!';
  const bookingId = location.state?.bookingId;

  return (
    <section className="booking-success">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="success-card p-4 text-center">
              <FaCheckCircle className="success-icon mb-4" />
              <h2>Booking Successful!</h2>
              <p className="lead mb-4">{message}</p>

              {bookingId && (
                <div className="booking-details text-start">
                  <h4>Booking Information</h4>
                  <p><strong>Booking ID:</strong> {bookingId}</p>
                  <p>Please keep this ID for future reference.</p>
                </div>
              )}

              <div className="contact-info mt-4">
                <h4>Payment Contact</h4>
                <p>For payment arrangements, please contact us:</p>
                <ul className="list-unstyled">
                  <li>Email: thanhlongn08@gmail.com</li>
                  <li>Phone: 0966441683</li>
                </ul>
              </div>

              <div className="mt-4">
                <Button color="primary" onClick={() => navigate('/my-bookings')}>
                  View My Bookings
                </Button>
                <Button color="link" onClick={() => navigate('/tours')}>
                  Browse More Tours
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BookingSuccess; 