import React from "react";
import "./newsletter.css";

import { Container, Row, Col } from "reactstrap";
import maleTourist from "../assets/images/male-tourist.png";

const Newsletter = () => {
  return (
    <section className="newsletter">
      <Container>
        <Row>
          <Col lg="6">
            <div className="newsletter_content">
              <h2>
                Subscribe now to receive thousands of exciting gifts and
                exclusive offers!
              </h2>
              <div className="newsletter__input">
                <input type="email" placeholder="Enter your email" />
                <button className="btn newsletter__btn">Subscribe</button>
              </div>
              <p>
                To connect with customers even more, TravelEasy regularly offers
                attractive promotions such as discounted incentive tours, free
                buffet tickets, travel discount vouchers, complimentary premium
                services (like 5-star hotel stays, traditional Thai massages,
                etc.), and many other special deals. TravelEasy is confident in
                providing you with a joyful and meaningful journey!
              </p>
            </div>
          </Col>
          <Col lg="6">
            <div className="newsletter__img">
              <img src={maleTourist} alt="" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newsletter;
