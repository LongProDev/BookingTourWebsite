import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import './booking.css';
import tourService from '../../services/tourService';
import bookingService from '../../services/bookingService';
import discountService from '../../services/discountService';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
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

  // Fetch tour data
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await tourService.getTourById(id);
        if (response && response.data) {
          setTour(response.data);
          setFormData(prev => ({
            ...prev,
            subtotal: response.data.price || 0,
            totalPrice: response.data.price || 0
          }));
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTour();
  }, [id]);

  const calculateTotalPrice = (adults, children, basePrice) => {
    if (!basePrice) return 0;
    const adultTotal = basePrice * adults;
    const childTotal = basePrice * 0.8 * children; // 80% of base price for children
    return adultTotal + childTotal;
  };

  // Update the form data when number of passengers changes
  const handlePassengerChange = (type, value) => {
    const adults = type === 'adults' ? parseInt(value) : formData.numberOfAdults;
    const children = type === 'children' ? parseInt(value) : formData.numberOfChildren;
    
    if (!selectedSchedule) return;

    const subtotal = calculateTotalPrice(
      adults,
      children,
      selectedSchedule.price
    );

    setFormData(prev => ({
      ...prev,
      [type === 'adults' ? 'numberOfAdults' : 'numberOfChildren']: parseInt(value),
      subtotal: subtotal,
      totalPrice: subtotal - prev.discount // Maintain any existing discount
    }));
  };

  const handleScheduleSelect = (e) => {
    const schedule = tour.schedules.find(s => s._id === e.target.value);
    setSelectedSchedule(schedule);
    
    if (schedule) {
      const subtotal = calculateTotalPrice(
        formData.numberOfAdults,
        formData.numberOfChildren,
        schedule.price
      );
      
      setFormData(prev => ({
        ...prev,
        subtotal: subtotal,
        totalPrice: subtotal - prev.discount // Maintain any existing discount
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!selectedSchedule) {
        alert('Please select a departure schedule');
        return;
      }

      if (!formData.paymentMethod) {
        alert('Please select a payment method');
        return;
      }

      if (!formData.agreedToPolicy) {
        alert('Please agree to the booking policy');
        return;
      }

      // Validate contact information
      if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
        alert('Please fill in all contact information');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customerEmail)) {
        alert('Please enter a valid email address');
        return;
      }

      const adults = parseInt(formData.numberOfAdults);
      const children = parseInt(formData.numberOfChildren);
      const totalPassengers = adults + children;

      if (totalPassengers <= 0) {
        alert('Please select at least one passenger');
        return;
      }

      if (totalPassengers > selectedSchedule.availableSeats) {
        alert(`Only ${selectedSchedule.availableSeats} seats available`);
        return;
      }

      const bookingData = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        numberOfAdults: adults,
        numberOfChildren: children,
        notes: formData.notes.trim(),
        paymentMethod: formData.paymentMethod,
        agreedToPolicy: true,
        tourId: tour._id,
        tourName: tour.name,
        scheduleId: selectedSchedule._id,
        departureDate: new Date(selectedSchedule.departureDate).toISOString(),
        departureTime: selectedSchedule.departureTime,
        returnDate: new Date(selectedSchedule.returnDate).toISOString(),
        returnTime: selectedSchedule.returnTime,
        transportation: selectedSchedule.transportation,
        discountCode: formData.discountCode.trim() || null,
        subtotal: Number(formData.subtotal),
        discount: Number(formData.discount),
        totalPrice: Number(formData.totalPrice)
      };

      const response = await bookingService.createBooking(bookingData);
      
      if (response.success) {
        navigate('/booking/success');
      } else {
        throw new Error(response.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error details:', error);
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
                  onChange={handleScheduleSelect}
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
                        onChange={(e) => handlePassengerChange('adults', e.target.value)}
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
                        onChange={(e) => handlePassengerChange('children', e.target.value)}
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
                    <span>Tour Price</span>
                    <span>${selectedSchedule.price} per person</span>
                  </div>
                  <div className="summary-item">
                    <span>Adults ({formData.numberOfAdults})</span>
                    <span>${(selectedSchedule.price * formData.numberOfAdults).toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Children ({formData.numberOfChildren})</span>
                    <span>${(selectedSchedule.price * 0.8 * formData.numberOfChildren).toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="summary-item">
                    <strong>Subtotal:</strong>
                    <strong>${formData.subtotal.toFixed(2)}</strong>
                  </div>
                  {formData.discount > 0 && (
                    <div className="summary-item text-success">
                      <span>Discount:</span>
                      <span>-${formData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-total">
                    <span>Total:</span>
                    <span>${formData.totalPrice.toFixed(2)}</span>
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