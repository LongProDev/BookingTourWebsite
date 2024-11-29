import React from 'react';
import { Container, Row, Col, Button, Card } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import './paymentConfirmation.css';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;

  if (!bookingData) {
    navigate('/tours');
    return null;
  }

  const handlePaymentChoice = async (paymentChoice) => {
    try {
      const status = paymentChoice === 'PAY_NOW' ? 'Processing' : 'Pending';
      const response = await bookingService.updateBookingPayment(
        bookingData._id, 
        status
      );

      if (response.success) {
        if (paymentChoice === 'PAY_NOW') {
          navigate('/payment-gateway', { 
            state: { bookingData: { ...bookingData, ...response.data } }
          });
        } else {
          navigate('/booking-success', { 
            state: { 
              message: 'Booking confirmed! Please pay later to secure your tour.',
              bookingId: bookingData._id
            } 
          });
        }
      } else {
        throw new Error(response.message || 'Failed to update payment status');
      }
    } catch (error) {
      console.error('Payment choice error:', error);
      alert(error.message || 'Failed to process payment choice. Please try again.');
    }
  };

  return (
    <section className="payment-confirmation">
      <Container>
        <Row className="justify-content-center">
          <Col lg="8">
            <Card className="p-4">
              <h2 className="text-center mb-4">Booking Summary</h2>
              
              <div className="booking-details">
                <h4>Tour Details</h4>
                <p><strong>Tour Name:</strong> {bookingData.tourName}</p>
                <p><strong>Date:</strong> {new Date(bookingData.scheduleDate).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {bookingData.location}</p>

                <h4 className="mt-4">Customer Information</h4>
                <p><strong>Name:</strong> {bookingData.customerName}</p>
                <p><strong>Email:</strong> {bookingData.customerEmail}</p>
                <p><strong>Phone:</strong> {bookingData.customerPhone}</p>

                <h4 className="mt-4">Booking Details</h4>
                <p><strong>Adults:</strong> {bookingData.numberOfAdults}</p>
                <p><strong>Children:</strong> {bookingData.numberOfChildren}</p>
                {bookingData.notes && <p><strong>Notes:</strong> {bookingData.notes}</p>}

                <div className="price-summary mt-4">
                  <div className="d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <span>${bookingData.subtotal.toFixed(2)}</span>
                  </div>
                  {bookingData.discount > 0 && (
                    <div className="d-flex justify-content-between text-success">
                      <span>Discount:</span>
                      <span>-${bookingData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between total-price">
                    <strong>Total Amount:</strong>
                    <strong>${bookingData.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="payment-options mt-4">
                  <h4>Choose Payment Option</h4>
                  <div className="d-flex gap-3 justify-content-center mt-3">
                    <Button 
                      color="primary" 
                      onClick={() => handlePaymentChoice('PAY_NOW')}
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PaymentConfirmation; 