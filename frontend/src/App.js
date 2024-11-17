import React from 'react';

import Header from './components/Header/Header';
import Routers from './routes/Routers';
import Footer from './components/Footer/Footer';
import './App.css';


const App = () => {
  return (
    <>
      <Header />
      <Routers />
      <Footer />
    </>
  );
};

export default App;
