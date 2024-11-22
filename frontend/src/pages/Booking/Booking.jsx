import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './booking.css';
import tourService from '../../services/tourService';
import bookingService from '../../services/bookingService';
import discountService from '../../services/discountService';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formData, setFormData] = useState({
    customerName: user?.username || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    numberOfAdults: 1,
    numberOfChildren: 0,
    notes: '',
    paymentMethod: '',
    agreedToPolicy: false,
    discountCode: '',
    subtotal: 0,
    discount: 0,
    totalPrice: 0
  });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await tourService.getTourById(id);
        if (response && response.data) {
          setTour(response.data);
          setFormData(prev => ({
            ...prev,
            tourName: response.data.name,
            totalPrice: response.data.price || 0
          }));
        } else {
          console.error('No tour data received');
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTour();
    }
  }, [id]);

  useEffect(() => {
    if (selectedSchedule) {
      const subtotal = (formData.numberOfAdults * selectedSchedule.price) + 
                      (formData.numberOfChildren * selectedSchedule.price * 0.75);
      setFormData(prev => ({
        ...prev,
        subtotal,
        totalPrice: subtotal - prev.discount
      }));
    }
  }, [selectedSchedule, formData.numberOfAdults, formData.numberOfChildren]);

  const handleDiscountCode = async () => {
    try {
      const response = await discountService.validateCode(formData.discountCode);
      if (response.success) {
        const discount = (formData.subtotal * response.data.percentage) / 100;
        setFormData(prev => ({
          ...prev,
          discount,
          totalPrice: prev.subtotal - discount
        }));
      }
    } catch (error) {
      alert('Invalid discount code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedSchedule) {
      alert('Please select a departure schedule');
      return;
    }

    if (!formData.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      const bookingData = {
        customerId: user._id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        numberOfAdults: parseInt(formData.numberOfAdults),
        numberOfChildren: parseInt(formData.numberOfChildren),
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        agreedToPolicy: formData.agreedToPolicy,
        tourName: tour.name,
        scheduleId: selectedSchedule._id,
        departureDate: selectedSchedule.departureDate,
        departureTime: selectedSchedule.departureTime,
        returnDate: selectedSchedule.returnDate,
        returnTime: selectedSchedule.returnTime,
        transportation: selectedSchedule.transportation,
        discountCode: formData.discountCode,
        subtotal: formData.subtotal,
        discount: formData.discount,
        totalPrice: formData.totalPrice
      };

      const response = await bookingService.createBooking(bookingData);
      if (response.success) {
        navigate('/booking/success');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!tour) return <div>Tour not found</div>;

  return (
    <section className="booking">
      <Container>
        <Row>
          <Col lg="8">
            <div className="booking-content">
              <h2>Book Your Tour</h2>
              
              {/* Schedule Selection */}
              <FormGroup>
                <Label>Select Departure Schedule</Label>
                <Input
                  type="select"
                  value={selectedSchedule?._id || ''}
                  onChange={(e) => {
                    const schedule = tour.schedules.find(s => s._id === e.target.value);
                    setSelectedSchedule(schedule);
                    setFormData(prev => ({
                      ...prev,
                      totalPrice: schedule?.price || 0
                    }));
                  }}
                  required
                >
                  <option value="">Select a schedule</option>
                  {tour.schedules.map(schedule => (
                    <option 
                      key={schedule._id} 
                      value={schedule._id}
                      disabled={schedule.availableSeats === 0}
                    >
                      {new Date(schedule.departureDate).toLocaleDateString()} - 
                      {schedule.departureTime} (${schedule.price}) - 
                      {schedule.availableSeats} seats left
                    </option>
                  ))}
                </Input>
              </FormGroup>

              {/* Contact Information */}
              <div className="contact-info mt-4">
                <h4>Contact Information</h4>
                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                    required
                  />
                </FormGroup>
              </div>

              {/* Passenger Information */}
              <div className="passenger-info mt-4">
                <h4>Number of Passengers</h4>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Adults</Label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.numberOfAdults}
                        onChange={(e) => setFormData({...formData, numberOfAdults: e.target.value})}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Children (under 12)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.numberOfChildren}
                        onChange={(e) => setFormData({...formData, numberOfChildren: e.target.value})}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>

              {/* Notes */}
              <FormGroup className="mt-4">
                <Label>Special Requirements / Notes</Label>
                <Input
                  type="textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </FormGroup>

              {/* Payment Method */}
              <div className="payment-method mt-4">
                <h4>Payment Method</h4>
                <FormGroup tag="fieldset">
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="paymentMethod"
                        value="PayPal"
                        checked={formData.paymentMethod === 'PayPal'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        required
                      /> PayPal
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="paymentMethod"
                        value="MoMo"
                        checked={formData.paymentMethod === 'MoMo'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      /> MoMo
                    </Label>
                  </FormGroup>
                </FormGroup>
              </div>

              {/* Policy Agreement */}
              <FormGroup check className="mt-4">
                <Label check>
                  <Input
                    type="checkbox"
                    checked={formData.agreedToPolicy}
                    onChange={(e) => setFormData({...formData, agreedToPolicy: e.target.checked})}
                    required
                  />
                  I agree to the booking terms and conditions
                </Label>
              </FormGroup>
            </div>
          </Col>

          {/* Booking Summary */}
          <Col lg="4">
            <div className="booking-summary">
              <h4>Booking Summary</h4>
              {tour.name} <br />

              {tour.description} <br />

              {tour.location} <br />

              {tour.time} <br />


              {selectedSchedule && (
                <>
                  <div className="summary-item">
                    <span>Adults ({formData.numberOfAdults})</span>
                    <span>${selectedSchedule.price * formData.numberOfAdults}</span>
                  </div>
                  <div className="summary-item">
                    <span>Children ({formData.numberOfChildren})</span>
                    <span>${selectedSchedule.price * formData.numberOfChildren * 0.75}</span>
                  </div>
                  <hr />
                  <div className="summary-item">
                    <span>Subtotal:</span>
                    <span>${formData.subtotal}</span>
                  </div>
                  <div className="discount-code">
                    <Input 
                      type="text" 
                      placeholder="Discount Code"
                      value={formData.discountCode}
                      onChange={(e) => setFormData({...formData, discountCode: e.target.value})}
                    />
                    <Button color="secondary" onClick={handleDiscountCode}>Apply</Button>
                  </div>
                  {formData.discount > 0 && (
                    <div className="summary-item text-success">
                      <span>Discount:</span>
                      <span>-${formData.discount}</span>
                    </div>
                  )}
                  <div className="summary-total">
                    <span>Total:</span>
                    <span>${formData.totalPrice}</span>
                  </div>
                </>
              )}
              <Button 
                className="booking__btn"
                color="primary" 
                block 
                disabled={!selectedSchedule || !formData.agreedToPolicy}
                onClick={handleSubmit}
              >
                Proceed to Payment
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Booking; 