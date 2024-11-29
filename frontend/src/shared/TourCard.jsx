import React, { useState } from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./tour-card.css";

const TourCard = ({ tour }) => {
  const { _id, name, image, time, startLocation, location, price, featured } =
    tour;

  const [imgSrc, setImgSrc] = useState(() => {
    if (!image || !image[0]) return "/images/placeholder.jpg";
    return image[0].startsWith("http")
      ? image[0]
      : `${process.env.REACT_APP_API_URL}/images/${image[0]}`;
  });

  const handleImageError = () => {
    console.error("Image failed to load:", imgSrc);
    setImgSrc("/images/placeholder.jpg");
  };

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
          <img src={imgSrc} alt={name} onError={handleImageError} />
          {featured && <span>Featured</span>}
        </div>
      </Card>

      <CardBody>
        <div className="tour__rating">
          <span className="rating__number">
            {tour?.ratingStats?.averageRating?.toFixed(1)}{" "}
            <i className="ri-star-fill"></i>
          </span>
          <span>({tour?.ratingStats?.numberOfReviews} reviews)</span>
        </div>
        <h3 className="tour__title">
          <Link to={`/tours/${_id}`}>{name}</Link>
        </h3>
        <div className="card__top d-flex justify-content-between">
          <span className="tour__startlocation d-flex  gap-1">
            <i className="ri-map-pin-line"></i>
            Start Location: {startLocation}
          </span>

          <span className="tour__location d-flex  gap-1">
            <i className="ri-map-pin-line"></i>
            Location: {location}
          </span>

          <span className="tour__time d-flex  gap-1">
            <i className="ri-time-line"></i> Time: {time}
          </span>
        </div>

        <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
          <h5>
            ${price} <span>/per person</span>
          </h5>
          <div className="tour__info d-flex align-items-center gap-3">
            <button className="btn booking__btn">
              <Link to={`/tours/${_id}/booking`}>Book Now</Link>
            </button>
          </div>
        </div>
      </CardBody>
    </div>
  );
};

export default TourCard;
