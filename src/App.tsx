import './App.css';
import {Route, Routes} from "react-router-dom"

import Drawing from './pages/Drawing';
import Landing from './pages/Landing';
import Gallery from './pages/Gallery';
import Canvas from './pages/Canvas'

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/drawing" element={<Drawing/>} />
      <Route path="/test" element={<Canvas/>} />
      <Route path="/gallery" element={<Gallery/>} />
    </Routes>
  );
}

export default App;
