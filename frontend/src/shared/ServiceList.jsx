import React from "react";
import ServiceCard from "./ServiceCard";
import { Col } from "reactstrap";

import weatherImg from "../assets/images/weather.png";
import guideImg from "../assets/images/guide.png";
import customizationImg from "../assets/images/customization.png";

const servicesData = [
  {
    imgUrl: weatherImg,
    title: "Test 1",
    desc: "Không đi thì phí quá. Book ngay thôi!",
  },
  {
    imgUrl: guideImg,
    title: "Test 2",
    desc: "Không đi thì phí quá. Book ngay thôi!",
  },
  {
    imgUrl: customizationImg,
    title: "Test 3",
    desc: "Không đi thì phí quá. Book ngay thôi!",
  },
];

const ServiceList = () => {
  return (
    <>
      {servicesData.map((item, index) => (
        <Col lg="3" md='6' sm='12' className='mb-4' key={index}>
          <ServiceCard item={item} />
        </Col>
      ))}
    </>
  );
};

export default ServiceList;
