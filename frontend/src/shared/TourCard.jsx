import React, { useState, useMemo } from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./tour-card.css";
import { isScheduleExpired, hasAvailableSeats } from '../utils/dateUtils';

const TourCard = ({ tour }) => {
  const {
    _id,
    name,
    image,
    time,
    startLocation,
    location,
    price,
    featured,
    schedules,
  } = tour;

  const [imgSrc, setImgSrc] = useState(() => {
    if (!image || !image[0]) return "/images/placeholder.jpg";
    return image[0].startsWith("http")
      ? image[0]
      : `${process.env.REACT_APP_API_URL}/images/${image[0]}`;
  });

  const minAvailableSeats = useMemo(() => {
    if (!schedules || schedules.length === 0) return 0;
    return Math.min(...schedules.map((schedule) => schedule.availableSeats));
  }, [schedules]);

  const handleImageError = () => {
    console.error("Image failed to load:", imgSrc);
    setImgSrc("/images/placeholder.jpg");
  };

  const isExpired = tour.schedules?.every(schedule => 
    isScheduleExpired(schedule.departureDate, schedule.departureTime)
  );

  const hasSeats = hasAvailableSeats(tour.schedules);

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
          <img src={imgSrc} alt={name} onError={handleImageError} />
          {featured && <span>Featured</span>}
        </div>
      </Card>

      <CardBody>
        <div className="tour-rating">
          <span className="rating__number">
            {tour?.ratingStats?.averageRating?.toFixed(1)}{" "}
            <i className="ri-star-fill"></i>
          </span>
          <span>({tour?.ratingStats?.numberOfReviews} reviews)</span>
        </div>
        <h5 className="tour__title" title={name}>
          <Link to={`/tours/${_id}`}>{name}</Link>
        </h5>
        <div className="card__top d-flex justify-content-between">
          <span className="tour__startlocation d-flex gap-1">
            <i className="ri-map-pin-line"></i>
            Start Location: {startLocation}
          </span>

          <span className="tour__location d-flex gap-1">
            <i className="ri-map-pin-line"></i>
            Location: {location}
          </span>

          <span className="tour__time d-flex gap-1">
            <i className="ri-time-line"></i> Time: {time}
          </span>
          <span className="available-seats">
            <i className="ri-user-line"></i> Only <span style={{ color: 'red' }}>{minAvailableSeats}</span> seats left
          </span>
        </div>

        <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
          <div className="tour__price">
            <h5>
              ${price} <span>/per person</span>
            </h5>
          </div>

          <div className="tour__info d-flex align-items-center gap-3">
            {isExpired || !hasSeats ? (
              <button className="btn booking__btn" disabled style={{ backgroundColor: 'gray' }}>
                {!hasSeats ? 'Sold Out' : 'Expired'}
              </button>
            ) : (
              <button className="btn booking__btn">
                <Link to={`/tours/${_id}/booking`}>Book Now</Link>
              </button>
            )}
          </div>
        </div>
      </CardBody>
    </div>
  );
};

export default TourCard;
