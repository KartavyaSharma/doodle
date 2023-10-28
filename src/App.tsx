import React, { useRef, useEffect, useState } from 'react';
// import './App.css';
import {Route, Routes} from "react-router-dom"

import Drawing from './pages/Drawing';
import Landing from './pages/Landing';
import Gallery from './pages/Gallery';


function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/drawing" element={<Drawing/>} />
      <Route path="/gallery" element={<Gallery/>} />
    </Routes>
  );
}

export default App;
