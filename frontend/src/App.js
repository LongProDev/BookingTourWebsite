import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import BackToTop from './components/common/BackToTop';
import Routes from './routes';

// Import CSS
import './assets/css/style.css';
import './assets/lib/animate/animate.min.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes />
      <BackToTop />
    </Router>
  );
};

export default App;
