import React from "react";
import "./home.css";

import { Container, Row, Col } from "reactstrap";
import heroImg from "../../assets/images/hero-img01.jpg";
import heroImg02 from "../../assets/images/hero-img02.jpg";
import heroVideo from "../../assets/images/hero-video.mp4";
import experienceImg from "../../assets/images/experience.png";

import Subtitle from "../../shared/Subtitle";
import SearchBar from "../../shared/SearchBar";

import FeaturedTourList from "../../components/Featured-tours/FeaturedTourList";
import MasonryImagesGallery from "../../components/Images-gallery/MasonryImagesGallery";
import Newsletter from "../../shared/Newsletter";

const Home = () => {
  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={"Know Before You Go"} />
                </div>
                <h1>
                  Traveling opens the door to creating{" "}
                  <span className="highlight"> memories</span>
                </h1>
                <p>
                  Why do you go away? So that you can come back. So that you can
                  see the place you came from with new eyes and extra colors.
                  And the people there see you differently, too. Coming back to
                  where you started is not the same as never leaving.
                </p>
              </div>
            </Col>
            <Col lg="6">
              <div className="hero__img-gallery d-flex justify-content-between">
                <div className="hero__img-box">
                  <img src={heroImg} alt="" />
                </div>
                <div className="hero__img-box hero__video-box mt-4">
                  <video src={heroVideo} controls />
                </div>
                <div className="hero__img-box mt-5">
                  <img src={heroImg02} alt="" />
                </div>
              </div>
            </Col>
            <SearchBar />
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle subtitle={"Explore"} />
              <h2 className="featured__tour-title">Our featured tours</h2>
            </Col>
            <FeaturedTourList />
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="experience__content">
                <Subtitle subtitle={"Experience"} />
                <h2>
                  With our all experience <br /> we will serve you
                </h2>
                <p>
                  With 10 years of experience in organizing and distributing
                  affordable, high-quality tours packed with the most exciting
                  experiences, TravelEasy has brought millions of travelers the
                  most worthwhile journeys. By quickly capturing travel trends,
                  TravelEasy is always at the forefront of offering attractive
                  itineraries and fresh destinations for the community of travel
                  enthusiasts. <br /> In addition, TravelEasy is an agent for over 200
                  domestic and international airlines and has an extensive
                  network of hotel partners while also providing visa services
                  to more than 100 countries. Whether it's a domestic or
                  international tour, TravelEasy ensures top-quality services at
                  the most affordable prices. All travelers need to do are three
                  simple steps: choose a tour, book it, and make
                  payment—TravelEasy will handle the rest. Just pack your bags,
                  wait for your travel date, and enjoy your journey!
                </p>
              </div>
              <div className="counter__wrapper d-flex align-items-center gap-5">
                <div className="counter__box">
                  <span>12k+</span>
                  <h6>Successful trip</h6>
                </div>
                <div className="counter__box">
                  <span>2k+</span>
                  <h6>Regular clients</h6>
                </div>
                <div className="counter__box">
                  <span>10+</span>
                  <h6>Years experience </h6>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="experience__img">
                <img src={experienceImg} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Gallery"}></Subtitle>
              <h2 className="gallery__title">
                Visit our customers tour gallery
              </h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default Home;
