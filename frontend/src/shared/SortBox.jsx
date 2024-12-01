import React from 'react';
import './sort-box.css';

const SortBox = ({ onSortChange, currentSort }) => {
  const sortOptions = [
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'date-near', label: 'Nearest Departure' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="sort-box">
      <label className="sort-label">Sort by:</label>
      <select 
        className="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortBox; 