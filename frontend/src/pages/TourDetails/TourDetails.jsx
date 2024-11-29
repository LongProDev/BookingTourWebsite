import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
} from "reactstrap";
import tourService from "../../services/tourService";
import "./tourDetails.css";

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });
  const [reviews, setReviews] = useState([]);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const fetchTour = async () => {
    try {
      const response = await tourService.getTourById(id);
      if (response && response.data) {
        const tourData = response.data;
        tourData.image = tourData.image.map((img) =>
          img.startsWith("http")
            ? img
            : `${process.env.REACT_APP_API_URL}/images/${img}`
        );
        setTour(tourData);
      }
    } catch (error) {
      console.error("Error fetching tour:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await tourService.getReviews(id);
      if (response && response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchTour();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (!tour || isPaused) return;

    const interval = setInterval(() => {
      const nextIndex =
        activeIndex === tour.image.length - 1 ? 0 : activeIndex + 1;
      setActiveIndex(nextIndex);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex, tour, isPaused]);

  const next = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === tour.image.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0 ? tour.image.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.src = "/images/placeholder.jpg";
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await tourService.createReview({
        tourId: id,
        rating: review.rating,
        comment: review.comment,
      });

      if (response.success) {
        setShowThankYouModal(true);
        setReview({ rating: 5, comment: "" });
        // Refresh tour data to update ratings
        fetchTour();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!tour) return <div className="not-found">Tour not found</div>;

  const slides = tour.image.map((img, index) => (
    <CarouselItem
      key={index}
      onExiting={() => setAnimating(true)}
      onExited={() => setAnimating(false)}
    >
      <img
        src={img}
        alt={`${tour.name} - View ${index + 1}`}
        className="w-100"
        style={{ height: "400px", objectFit: "cover" }}
        onError={handleImageError}
      />
    </CarouselItem>
  ));

  const reviewSection = (
    <div className="tour-reviews mt-5">
      <h5>Reviews</h5>

      <Form onSubmit={handleReviewSubmit} className="review-form mb-4">
        <FormGroup>
          <Label for="rating">Rating</Label>
          <Input
            type="select"
            name="rating"
            id="rating"
            value={review.rating}
            onChange={(e) =>
              setReview({ ...review, rating: parseInt(e.target.value) })
            }
          >
            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4">⭐⭐⭐⭐ (4)</option>
            <option value="3">⭐⭐⭐ (3)</option>
            <option value="2">⭐⭐ (2)</option>
            <option value="1">⭐ (1)</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="comment">Your Review</Label>
          <Input
            type="textarea"
            name="comment"
            id="comment"
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            placeholder="Share your experience..."
            rows="4"
          />
        </FormGroup>

        <Button color="primary" type="submit">
          Submit Review
        </Button>
      </Form>

      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-item p-3 mb-2 bg-light rounded">
            <div className="d-flex justify-content-between">
              <div>{"⭐".repeat(review.rating)}</div>
              <small className="text-muted">
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
            <p className="mb-0 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <section className="tour-details">
        <Container>
          <Row>
            <Col lg="8">
              <div className="tour-content">
                <div className="tour-images mb-4">
                  <Carousel
                    activeIndex={activeIndex}
                    next={next}
                    previous={previous}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <CarouselIndicators
                      items={tour.image}
                      activeIndex={activeIndex}
                      onClickHandler={goToIndex}
                    />
                    {slides}
                    <CarouselControl
                      className="carousel-control-prev"
                      direction="prev"
                      directionText="Previous"
                      onClickHandler={previous}
                    />
                    <CarouselControl
                      className="carousel-control-next"
                      direction="next"
                      directionText="Next"
                      onClickHandler={next}
                    />
                  </Carousel>
                </div>

                <div className="tour-info">
                  <div className="tour__rating d-flex align-items-center gap-3">
                    <span className="rating__number">
                      {tour?.ratingStats?.averageRating?.toFixed(1)}{" "}
                      <i className="ri-star-fill"></i>
                    </span>
                    <span>({tour?.ratingStats?.numberOfReviews} reviews)</span>
                  </div>

                  <h2>{tour.name}</h2>
                  <h5>Description</h5>
                  <div dangerouslySetInnerHTML={{ __html: tour.description }} />
                  <div className="tour-schedules mt-4">
                    <h5>Available Schedules</h5>
                    {tour.schedules && tour.schedules.length > 0 ? (
                      <div className="schedules-list">
                        {tour.schedules.map((schedule, index) => (
                          <div
                            key={schedule._id}
                            className="schedule-item p-3 mb-2 bg-light rounded"
                          >
                            <h6>Schedule {index + 1}</h6>
                            <div className="d-flex flex-wrap gap-3">
                              <span>
                                <i className="ri-calendar-line"></i> Departure:{" "}
                                {new Date(
                                  schedule.departureDate
                                ).toLocaleDateString()}{" "}
                                at {schedule.departureTime}
                              </span>
                              <span>
                                <i className="ri-calendar-check-line"></i>{" "}
                                Return:{" "}
                                {new Date(
                                  schedule.returnDate
                                ).toLocaleDateString()}{" "}
                                at {schedule.returnTime}
                              </span>
                              <span>
                                <i className="ri-user-line"></i> Available
                                Seats: {schedule.availableSeats}
                              </span>
                              <span>
                                <i className="ri-money-dollar-circle-line"></i>{" "}
                                Price: ${schedule.price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No schedules available for this tour.</p>
                    )}
                  </div>
                  {reviewSection}
                </div>
              </div>
            </Col>

            <Col lg="4">
              <div className="tour-summary">
                <h2>About this tour</h2>
                <div className="summary-item">
                  <i className="ri-map-pin-line"></i>
                  <span>Departure: {tour.startLocation}</span>
                </div>
                <div className="summary-item">
                  <i className="ri-map-pin-line"></i>
                  <span>Destination: {tour.location}</span>
                </div>
                <div className="summary-item">
                  <i className="ri-group-line"></i>
                  <span>Group Size: {tour.maxPeople} people</span>
                </div>
                <div className="summary-item">
                  <i className="ri-time-line"></i>
                  <span>Duration: {tour.time}</span>
                </div>
                <div className="summary-price">
                  <h4>${tour.price}</h4>
                  <span>/person</span>
                </div>
                <Button className="w-100 mt-3 booking__btn">
                  <Link
                    to={`/tours/${tour._id}/booking`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Book Now
                  </Link>
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal
        isOpen={showThankYouModal}
        toggle={() => setShowThankYouModal(false)}
        centered
      >
        <ModalBody className="text-center py-4">
          <i className="ri-checkbox-circle-line text-success display-4 mb-3"></i>
          <h4>Thank You!</h4>
          <p>Your review has been submitted successfully.</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowThankYouModal(false)}
          >
            Close
          </button>
        </ModalBody>
      </Modal>
    </>
  );
};

export default TourDetails;
