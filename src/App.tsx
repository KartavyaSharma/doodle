import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom"
import { Link } from 'react-router-dom';

import Drawing from './pages/Drawing';
import Gallery from './pages/Gallery';
import Live from './pages/Live';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <div id="mainNavbar">
      <nav className="navbar navbar-dark">
        <div className="navbar-container">
          <div className="navbar-brand">
            <img src="./logo.svg" alt="Logo" className="small-logo" />
          </div>
          
          <img src={isMenuOpen ? "./x.svg" : "./hamburger.svg"} alt="Menu Toggle" className="navbar-hamburger" onClick={toggleMenu} />

        </div>
      </nav>

      {isMenuOpen && (
        <div className="navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/gallery" className="nav-link" onClick={toggleMenu}>Gallery</Link>
            </li>
            <li className="nav-item">
              <Link to="/live" className="nav-link" onClick={toggleMenu}>Live</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

function App() {
  
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Drawing/>} />
        <Route path="/live" element={<Live/>} />
        <Route path="/gallery" element={<Gallery/>} />
      </Routes>
    </div>
  );
}

export default App;
