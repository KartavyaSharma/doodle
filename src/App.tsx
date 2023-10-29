import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";

import Draw from './pages/Draw';
import Gallery from './pages/Gallery';
import Live from './pages/Live';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <div id="navbar">
        <Link id="navLogo" to="/">
          <img src="./logo.svg" alt="Logo"/>
        </Link>

        <div id="navLinks">
          <Link to="/leaderboard" className="navLink" onClick={() => setMenuOpen(false)}>Leaderboard</Link>
          <Link to="/gallery" className="navLink" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link to="/live" className="navLink" onClick={() => setMenuOpen(false)}>Live</Link>
        </div>
        <img id="navHamburger" src={menuOpen ? "./x.svg" : "./hamburger.svg"} alt="Menu Toggle" onClick={() => setMenuOpen(!menuOpen)} />
      </div>

      { menuOpen && 
        <div id="navMenu">
          <Link to="/leaderboard" className="navLink" onClick={() => setMenuOpen(false)}>Leaderboard</Link>
          <Link to="/gallery" className="navLink" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link to="/live" className="navLink" onClick={() => setMenuOpen(false)}>Live</Link>
        </div>
      }
    </nav>
  )
};

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Draw/>} />
          <Route path="/live" element={<Live/>} />
          <Route path="/gallery" element={<Gallery/>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
