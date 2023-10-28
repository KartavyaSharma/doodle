import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom"

import Drawing from './pages/Drawing';
import Gallery from './pages/Gallery';
import Live from './pages/Live';
import Canvas from './pages/Canvas'

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Drawing/>} />
      <Route path="/live" element={<Live/>} />
      <Route path="/gallery" element={<Gallery/>} />
    </Routes>
  );
}

export default App;
