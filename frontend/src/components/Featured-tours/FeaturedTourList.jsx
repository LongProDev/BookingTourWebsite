import React from "react";
import TourCard from "../../shared/TourCard";
import { Col } from "reactstrap";
import useFetch from "../../hooks/useFetch";
import { BASE_URL } from "../../utils/config.js";

const FeaturedTourList = () => {
  const {
    data: featuredTours,
    error,
    loading,
  } = useFetch(`${BASE_URL}/tours/search/getFeaturedTours`);

  console.log("Featured tours:", featuredTours);
  console.log("Error:", error);
  console.log("Loading:", loading);

  if (loading) return <h4>Loading...</h4>;
  if (error) return <h4>Error: {error}</h4>;

  if (!featuredTours || featuredTours.length === 0) {
    return <h4>No featured tours found</h4>;
  }

  return (
    <>
      {featuredTours.map((tour) => (
        <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
          <TourCard tour={tour} />
        </Col>
      ))}
    </>
  );
};

export default FeaturedTourList;
