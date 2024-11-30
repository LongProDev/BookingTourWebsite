import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import CommonSection from '../../shared/CommonSection';
import './about.css';

const About = () => {
  return (
    <>
      <CommonSection title="About Us" />
      
      <section className="about__section">
        <Container>
          <Row>
            <Col lg="6">
              <div className="about__content">
                <h2>Welcome to TravelEasy</h2>
                <p>
                  With 10 years of experience in organizing and distributing affordable, 
                  high-quality tours packed with the most exciting experiences, TravelEasy 
                  has brought millions of travelers the most worthwhile journeys.
                </p>
                <p>
                  By quickly capturing travel trends, TravelEasy is always at the forefront 
                  of offering attractive itineraries and fresh destinations for the community 
                  of travel enthusiasts.
                </p>
              </div>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col lg="12">
              <div className="contact__info">
                <h3>Contact Information</h3>
                <div className="contact__details">
                  <div className="contact__item">
                    <i className="ri-map-pin-line"></i>
                    <div>
                      <h5>Address</h5>
                      <p>123 Travel Street, Tourism District, City, Country</p>
                    </div>
                  </div>

                  <div className="contact__item">
                    <i className="ri-mail-line"></i>
                    <div>
                      <h5>Email</h5>
                      <p>traveleasy@gmail.com</p>
                    </div>
                  </div>

                  <div className="contact__item">
                    <i className="ri-phone-line"></i>
                    <div>
                      <h5>Phone</h5>
                      <p>+84 983868686</p>
                    </div>
                  </div>

                  <div className="contact__item">
                    <i className="ri-time-line"></i>
                    <div>
                      <h5>Working Hours</h5>
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 12:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About; 