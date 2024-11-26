import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'reactstrap';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import paymentService from '../../services/paymentService';

// Initialize Stripe outside component to prevent multiple initializations

const stripePromise = process.env.REACT_APP_STRIPE_PUBLIC_KEY 
  ? loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
  : null;

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const bookingData = location.state?.bookingData;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    if (!bookingData) {
      navigate('/tours');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handlePaymentTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingData, navigate]);

  const handlePaymentTimeout = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/bookings/${bookingData._id}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      navigate('/booking-failed', {
        state: { message: 'Payment timeout. Your booking has been cancelled.' }
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking. Please contact support.');
    }
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPaymentError(null);

      if (!bookingData?.paymentMethod) {
        throw new Error('Please select a payment method');
      }

      if (bookingData.paymentMethod === 'Stripe') {
        if (!stripePromise) {
          throw new Error('Payment system is not properly configured. Please contact support.');
        }

        const response = await paymentService.createStripeCheckout(bookingData);
        if (response.url) {
          window.location.href = response.url;
        } else {
          throw new Error('Invalid Stripe payment response');
        }
      } else if (bookingData.paymentMethod === 'MoMo') {
        const momoResponse = await paymentService.createMoMoPayment(bookingData);
        if (momoResponse.payUrl) {
          window.location.href = momoResponse.payUrl;
        } else {
          throw new Error('Invalid MoMo payment response');
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderPaymentMethod = () => {
    if (isLoading) {
      return <div className="text-center"><Spinner color="primary" /></div>;
    }

    if (error) {
      return <Alert color="danger">{error}</Alert>;
    }

    return (
      <div className="payment-actions">
        <Button
          color="primary"
          block
          onClick={handlePayment}
          disabled={isLoading || !bookingData?.paymentMethod}
        >
          {isLoading ? 'Processing...' : `Pay with ${bookingData?.paymentMethod}`}
        </Button>
        
        {paymentError && (
          <Alert color="danger" className="mt-3">
            {paymentError}
          </Alert>
        )}
      </div>
    );
  };

  return (
    <section className="payment-gateway">
      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <Card className="p-4">
              <h2 className="text-center mb-4">Complete Your Payment</h2>
              
              <Alert color="info">
                Time remaining: {formatTime(timeLeft)}
              </Alert>

              <div className="payment-details text-center">
                <h4>Total Amount: ${bookingData?.totalPrice}</h4>
                <p>Booking ID: {bookingData?._id}</p>
                <p>Payment Method: {bookingData?.paymentMethod}</p>

                {renderPaymentMethod()}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PaymentGateway;