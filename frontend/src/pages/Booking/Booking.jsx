import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "./booking.css";
import tourService from "../../services/tourService";
import bookingService from "../../services/bookingService";
import PaymentGateway from "../../pages/Payment/PaymentGateway";
import { toast } from "react-hot-toast";
import { isScheduleExpired } from '../../utils/dateUtils';
import NotificationModal from '../../components/NotificationModal/NotificationModal';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    numberOfAdults: 1,
    numberOfChildren: 0,
    notes: "",
    paymentMethod: "",
    agreedToPolicy: false,
    discountCode: "",
    subtotal: 0,
    discount: 0,
    totalPrice: 0,
  });
  const [bookingData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Fetch tour data
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await tourService.getTourById(id);
        if (response && response.data) {
          setTour(response.data);
          setFormData((prev) => ({
            ...prev,
            subtotal: response.data.price || 0,
            totalPrice: response.data.price || 0,
          }));
        }
      } catch (error) {
        console.error("Error fetching tour:", error);
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

  const validateSeats = (adults, children, schedule) => {
    const totalRequested = adults + children;
    if (!schedule) return false;
    
    if (schedule.availableSeats < totalRequested) {
      setModalMessage(`Sorry, there are only ${schedule.availableSeats} seats available for this schedule.`);
      setModalOpen(true);
      return false;
    }
    return true;
  };

  const handlePassengerChange = (type, value) => {
    const adults = type === "adults" ? parseInt(value) : formData.numberOfAdults;
    const children = type === "children" ? parseInt(value) : formData.numberOfChildren;

    if (!selectedSchedule) return;

    if (!validateSeats(adults, children, selectedSchedule)) {
      return;
    }

    const subtotal = calculateTotalPrice(adults, children, tour.price);

    setFormData((prev) => ({
      ...prev,
      [type === "adults" ? "numberOfAdults" : "numberOfChildren"]: parseInt(value),
      subtotal: subtotal,
      totalPrice: subtotal - prev.discount,
    }));
  };

  const handleScheduleSelect = (e) => {
    const schedule = tour.schedules.find((s) => s._id === e.target.value);
    setSelectedSchedule(schedule);

    if (schedule) {
      const subtotal = calculateTotalPrice(
        formData.numberOfAdults,
        formData.numberOfChildren,
        tour.price
      );

      setFormData((prev) => ({
        ...prev,
        subtotal: subtotal,
        totalPrice: subtotal - prev.discount,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const totalSeats = formData.numberOfAdults + formData.numberOfChildren;
      const bookingData = {
        ...formData,
        tourId: id,
        tourName: tour.name,
        scheduleId: selectedSchedule._id,
        scheduleDate: selectedSchedule.departureDate,
        departureDate: selectedSchedule.departureDate,
        departureTime: selectedSchedule.departureTime,
        returnDate: selectedSchedule.returnDate,
        returnTime: selectedSchedule.returnTime,
        transportation: selectedSchedule.transportation,
        location: tour.location,
        seatsToUpdate: totalSeats,
        tourStatus: "Pending",
        paymentStatus: "Pending",
      };

      const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        navigate("/payment-confirmation", {
          state: {
            bookingData: { ...response.data, ...bookingData },
          },
        });
      } else {
        throw new Error(response.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to create booking");
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
                  value={selectedSchedule?._id || ""}
                  onChange={handleScheduleSelect}
                  required
                >
                  <option value="">Select a schedule</option>
                  {tour.schedules.map((schedule) => {
                    const expired = isScheduleExpired(schedule.departureDate, schedule.departureTime);
                    return (
                      <option
                        key={schedule._id}
                        value={schedule._id}
                        disabled={expired || schedule.availableSeats === 0}
                      >
                        Departure: {new Date(schedule.departureDate).toLocaleDateString()} -
                        Transportation: {schedule.transportation} -
                        Departure Time: {schedule.departureTime} -
                        Available Seats: {schedule.availableSeats}
                        {expired ? ' (Expired)' : ''}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>

              {/* Contact Information */}
              <div className="contact-info mt-4">
                <h4>Contact Information</h4>
                <FormGroup>
                  <Label>Full Name*</Label>
                  <Input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Email*</Label>
                  <Input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerEmail: e.target.value,
                      })
                    }
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Phone*</Label>
                  <Input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerPhone: e.target.value,
                      })
                    }
                    required
                  />
                </FormGroup>
              </div>

              {/* Passenger Information */}
              <div className="passenger-info mt-4">
                <h4>Number of Passengers*</h4>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Adults*</Label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.numberOfAdults}
                        onChange={(e) =>
                          handlePassengerChange("adults", e.target.value)
                        }
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Children* (under 12)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.numberOfChildren}
                        onChange={(e) =>
                          handlePassengerChange("children", e.target.value)
                        }
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
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </FormGroup>

              {/* Payment Method */}
              <div className="payment-method mt-4">
                <h4>Payment Method*</h4>
                <FormGroup tag="fieldset">
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="paymentMethod"
                        value="Stripe"
                        checked={formData.paymentMethod === "Stripe"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentMethod: e.target.value,
                          })
                        }
                        required
                      />{" "}
                      Stripe
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreedToPolicy: e.target.checked,
                      })
                    }
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
              <h3>Booking Summary</h3>
              <h5>Tour Name: {tour.name}</h5>
              <p>Description: {tour.description}</p>
              
              <span className="tour__location d-flex gap-1">
                <i className="ri-map-pin-line"></i>
                Location: {tour.location}
              </span>
              <span className="tour__time d-flex gap-1">
                <i className="ri-time-line"></i> Time: {tour.time}
              </span>

              {selectedSchedule && (
                <>
                  <div className="summary-item">
                    <span>Tour Price:</span>
                    <span>  ${tour.price} per person</span>
                  </div>
                  <div className="summary-item">
                    <span>Adults({formData.numberOfAdults}):  </span>
                    <span>
                      ${(tour.price * formData.numberOfAdults).toFixed(2)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span>Children({formData.numberOfChildren}):  </span>
                    <span>
                      $
                      {(tour.price * 0.8 * formData.numberOfChildren).toFixed(
                        2
                      )}
                    </span>
                  </div>
                  <hr />
                  <div className="summary-item">
                    <strong>Subtotal:</strong>
                    <strong>  ${formData.subtotal.toFixed(2)}</strong>
                  </div>
                  <div className="summary-total">
                    <span>Total:</span>
                    <span>  ${formData.totalPrice.toFixed(2)}</span>
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
      {bookingData && <PaymentGateway bookingData={bookingData} />}
      <NotificationModal 
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        message={modalMessage}
      />
    </section>
  );
};

export default Booking;
