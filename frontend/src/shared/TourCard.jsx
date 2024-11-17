import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

import "./tour-card.css";

const TourCard = ({ tour }) => {
  const { _id, name, photo, time, maxpeople, startLocation, location, price, featured } = tour;

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
          <img src={photo} alt="tour-img" />
          {featured && <span>Featured</span>}
        </div>
      </Card>

      <CardBody>
        <div className="card__top d-flex align-items-center justify-content-between">
          <span className="tour__startlocation d-flex align-items-center gap-1">
            <i className="ri-map-pin-line"></i>
            {startLocation}
          </span>
          <span className="tour__location d-flex align-items-center gap-1">
            <i className="ri-map-pin-line"></i>
            {location}
          </span>
          <span className="tour__rating d-flex align-items-center gap-1">
            <i className="ri-time-line"></i> {time}
          </span>
        </div>

        <h5 className="tour__title">
          <Link to={`/tours/${_id}`}>{name}</Link>
        </h5>

        <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
          <h5>
            ${price} <span>/per person</span>
          </h5>
          <div className="tour__info d-flex align-items-center gap-3">
            <span className="d-flex align-items-center gap-1">
              <i className="ri-user-line"></i> {maxpeople}
            </span>
            <button className="btn booking__btn">
              <Link to={`/tours/${_id}`}>Book Now</Link>
            </button>
          </div>
        </div>
      </CardBody>
    </div>
  );
};

export default TourCard;
