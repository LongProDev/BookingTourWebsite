import React from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import PopularTours from '../components/Home/PopularTours';
import Destinations from '../components/Home/Destinations';

const HomePage = () => {
  // Example data - replace with actual API calls
  const tours = [
    {
      _id: '1',
      name: 'Ha Long Bay Cruise',
      price: 199,
      image: '/images/halong.jpg',
      time: '2 Days 1 Night',
      startLocation: 'Hanoi'
    },
    // Add more tours...
  ];

  const destinations = [
    {
      id: '1',
      name: 'Ha Long Bay',
      image: '/images/halong-destination.jpg'
    },
    // Add more destinations...
  ];

  return (
    <div>
      <HeroBanner />
      <PopularTours tours={tours} />
      <Destinations destinations={destinations} />
    </div>
  );
};

export default HomePage; 