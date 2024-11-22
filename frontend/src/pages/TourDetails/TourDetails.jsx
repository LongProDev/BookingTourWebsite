import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Carousel,
  CarouselItem,
  Button,
} from "reactstrap";
import tourService from "../../services/tourService";
import "./tourDetails.css";


const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await tourService.getTourById(id);
        if (response.success) {
          setTour(response.data);
        }
      } catch (error) {
        console.error("Error fetching tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!tour) return <div className="not-found">Tour not found</div>;

  return (
    <section className="tour-details">
      <Container>
        <Row>
          <Col lg="8">
            <div className="tour-content">
              <div className="tour-images mb-4">
                {tour.image && tour.image.length > 0 ? (
                  <Carousel>
                    {tour.image.map((img, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={`${process.env.REACT_APP_API_URL}/images/${img}`}
                          alt={`${tour.name} - View ${index + 1}`}
                          className="w-100"
                          style={{ height: "400px", objectFit: "cover" }}
                          onError={(e) => {
                            console.error('Image failed to load:', img);
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      </CarouselItem>
                    ))}
                  </Carousel>
                ) : (
                  <img
                    src="/placeholder.jpg"
                    alt="Tour placeholder"
                    className="w-100"
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                )}
              </div>

              <div className="tour-description mb-4">
                <h3>About this tour</h3>
                <div dangerouslySetInnerHTML={{ __html: tour.description }} />
              </div>
            </div>
          </Col>

          <Col lg="4">
            <div className="tour-summary">
              <h2>{tour.name}</h2>
              <div className="summary-item">
                <i className="ri-map-pin-line"></i>
                <span>Departure: {tour.startLocation}</span>
              </div>
              <div className="summary-item">
                <i className="ri-map-pin-line"></i>
                <span>Destination: {tour.location}</span>
              </div>
              <div className="summary-item">
                <i className="ri-calendar-line"></i>
                <span>Date: {tour.date ? new Date(tour.date).toLocaleDateString() : 'Date not available'}</span>
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
                <span>per person</span>
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
  );
};

export default TourDetails; 