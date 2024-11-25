import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './toursDropdown.css';

const ToursDropdown = () => {
  const [activeTab, setActiveTab] = useState('domestic');

  const domesticTours = {
    north: {
      title: 'North Vietnam',
      cities: ['Hanoi', 'Ha Long Bay', 'Sapa', 'Ninh Binh']
    },
    central: {
      title: 'Central Vietnam',
      cities: ['Hue', 'Da Nang', 'Hoi An', 'Nha Trang']
    },
    south: {
      title: 'South Vietnam',
      cities: ['Ho Chi Minh City', 'Mekong Delta', 'Phu Quoc', 'Da Lat']
    }
  };

  const foreignTours = {
    asian: {
      title: 'Asia',
      cities: ['Japan', 'South Korea', 'Thailand', 'China']
    },
    europe: {
      title: 'Europe',
      cities: ['London', 'Paris', 'Rome', 'Germany']
    },
    america: {
      title: 'America',
      cities: ['New York', 'Los Angeles', 'Chicago', 'Canada']
    }
  };

  return (
    <div className="tours-dropdown">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'domestic' ? 'active' : ''}`}
          onClick={() => setActiveTab('domestic')}
        >
          Domestic Tours
        </button>
        <button 
          className={`tab ${activeTab === 'foreign' ? 'active' : ''}`}
          onClick={() => setActiveTab('foreign')}
        >
          Foreign Tours
        </button>
      </div>

      {activeTab === 'domestic' ? (
        <div className="dropdown-section domestic">
          <div className="regions-container">
            {Object.values(domesticTours).map((region) => (
              <div key={region.title} className="region">
                <h5>{region.title}</h5>
                <ul>
                  {region.cities.map((city) => (
                    <li key={city}>
                      <Link to={`/tours/search?location=${city}`}>{city}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="dropdown-section foreign">
          <div className="countries-container">
            {Object.values(foreignTours).map((country) => (
              <div key={country.title} className="country">
                <h5>{country.title}</h5>
                <ul>
                  {country.cities.map((city) => (
                    <li key={city}>
                      <Link to={`/tours/search?location=${city}`}>{city}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToursDropdown; 