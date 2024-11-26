import React, { useState, useRef } from "react";
import TourCard from "../../shared/TourCard";
import useFetch from "../../hooks/useFetch";
import { BASE_URL } from "../../utils/config.js";
import "./featuredTourList.css";

const FeaturedTourList = () => {
  const {
    data: featuredTours,
    error,
    loading,
  } = useFetch(`${BASE_URL}/tours/search/getFeaturedTours`);

  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300; // Adjust this value to control scroll distance
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  if (loading) return <h4>Loading...</h4>;
  if (error) return <h4>Error: {error}</h4>;
  if (!featuredTours || featuredTours.length === 0) {
    return <h4>No featured tours found</h4>;
  }

  return (
    <div className="featured-tours-container">
      <button 
        className="scroll-button left"
        onClick={() => scroll('left')}
        style={{ visibility: scrollPosition <= 0 ? 'hidden' : 'visible' }}
      >
        <i className="ri-arrow-left-s-line"></i>
      </button>

      <div className="featured-tours-scroll" ref={scrollContainerRef}>
        {featuredTours.map((tour) => (
          <div className="featured-tour-item" key={tour._id}>
            <TourCard tour={tour} />
          </div>
        ))}
      </div>

      <button 
        className="scroll-button right"
        onClick={() => scroll('right')}
        style={{ 
          visibility: scrollContainerRef.current && 
            scrollPosition >= scrollContainerRef.current.scrollWidth - 
            scrollContainerRef.current.clientWidth ? 'hidden' : 'visible' 
        }}
      >
        <i className="ri-arrow-right-s-line"></i>
      </button>
    </div>
  );
};

export default FeaturedTourList;
