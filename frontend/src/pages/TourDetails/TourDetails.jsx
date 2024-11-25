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

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await tourService.getTourById(id);
        console.log('Tour response:', response);
        if (response && response.data) {
          const tourData = response.data;
          // Format image URLs
          tourData.image = tourData.image.map(img => 
            img.startsWith('http') 
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
    fetchTour();
  }, [id]);

  useEffect(() => {
    if (!tour || isPaused) return;

    const interval = setInterval(() => {
      const nextIndex = activeIndex === tour.image.length - 1 ? 0 : activeIndex + 1;
      setActiveIndex(nextIndex);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex, tour, isPaused]);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === tour.image.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? tour.image.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.src = '/images/placeholder.jpg';
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

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

  return (
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
                    direction="prev"
                    directionText="Previous"
                    onClickHandler={previous}
                  />
                  <CarouselControl
                    direction="next"
                    directionText="Next"
                    onClickHandler={next}
                  />
                </Carousel>
              </div>

              <div className="tour-info">
                <h2>{tour.name}</h2>
                <div className="d-flex align-items-center gap-5">
                  <span className="tour__location d-flex align-items-center gap-1">
                    <i className="ri-map-pin-line"></i> {tour.location}
                  </span>
                  <span className="tour__rating d-flex align-items-center gap-1">
                    <i className="ri-time-line"></i> {tour.time}
                  </span>
                </div>
                <div className="tour__extra-details">
                  <span>
                    <i className="ri-map-pin-line"></i> {tour.startLocation}
                  </span>
                  <span>
                    <i className="ri-group-line"></i> {tour.maxPeople} people
                  </span>
                </div>
                <h5>Description</h5>
                <div dangerouslySetInnerHTML={{ __html: tour.description }} />
                <div className="tour-schedules mt-4">
                  <h5>Available Schedules</h5>
                  {tour.schedules && tour.schedules.length > 0 ? (
                    <div className="schedules-list">
                      {tour.schedules.map((schedule, index) => (
                        <div key={schedule._id} className="schedule-item p-3 mb-2 bg-light rounded">
                          <h6>Schedule {index + 1}</h6>
                          <div className="d-flex flex-wrap gap-3">
                            <span>
                              <i className="ri-calendar-line"></i> Departure:{' '}
                              {new Date(schedule.departureDate).toLocaleDateString()} at {schedule.departureTime}
                            </span>
                            <span>
                              <i className="ri-calendar-check-line"></i> Return:{' '}
                              {new Date(schedule.returnDate).toLocaleDateString()} at {schedule.returnTime}
                            </span>
                            <span>
                              <i className="ri-user-line"></i> Available Seats: {schedule.availableSeats}
                            </span>
                            <span>
                              <i className="ri-money-dollar-circle-line"></i> Price: ${schedule.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No schedules available for this tour.</p>
                  )}
                </div>
              </div>
            </div>
          </Col>

          <Col lg="4">
            <div className="booking-info mt-4">
              <div className="tour__info">
                <h3>Information</h3>
                <div className="d-flex align-items-center gap-5">
                  <span className="tour__rating d-flex align-items-center gap-1">
                    <i className="ri-time-line"></i> {tour.time}
                  </span>
                  <span className="tour__location d-flex align-items-center gap-1">
                    <i className="ri-map-pin-line"></i> {tour.location}
                  </span>
                </div>
                <h5 className="mt-3">Price: ${tour.price} per person</h5>
                <Button className="w-100 mt-4 booking__btn">
                  <Link
                    to={`/tours/${tour._id}/booking`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Book Now
                  </Link>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TourDetails; 