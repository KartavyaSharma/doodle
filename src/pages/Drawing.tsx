import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

const TIMEFORDRAWING = 5;
const SEND_IMG_URL = "https://helpful-hornet-86.convex.site/sendImage"
const host = window.location.hostname;


const colorClasses = [
  'color-brown',
  'color-red',
  'color-yellow',
  'color-green',
  'color-blue',
  'color-purple'
];

const handleColorChange = (colorClass) => {
  // Handle color change logic here. This is a placeholder.
  console.log(`Color changed to ${colorClass}`);
};

const handleDelete = () => {
  // Handle the delete logic here. This is a placeholder.
  console.log("Delete button clicked");
};

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

  


export default function Drawing() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState(false);
  const [drawingg, setDrawing] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [countdown, setCountDown] = useState(TIMEFORDRAWING)
  
  // Add modal state and functions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
 
  const submitForm = () => {
    closeModal();
    if (selectedImage) {
      console.log("Sent Image with username:", username);
      fetch(SEND_IMG_URL, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage, 
      }).then(() => {
        window.location.href = `/gallery`;
      }).catch(() => {
        window.location.href = `/gallery`;
      });
    }
  };
  
  
  
  const startButtonHandler = () => {
    setStart(true);
  };

  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        setCountDown(prev => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        setDrawing(false);
        canvasRef.current.toBlob((blob) => {
          setSelectedImage(blob);
        });
      }, TIMEFORDRAWING * 1000); // Convert seconds to milliseconds
    }
  }, [start]);

  useEffect(() => {

    if (selectedImage) {
      openModal();
    }
  }, [selectedImage])

  useEffect(() => {
    if (drawingg && start) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let drawing = false;

      const startDrawing = (e) => {
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        setIsDrawing(true);
      };

      const draw = (e) => {
        if (!isDrawing) return;
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
      };

      const stopDrawing = () => {
        ctx.closePath();
        setIsDrawing(false);
      };

      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);

      return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseout', stopDrawing);
      };
    }
  }, [isDrawing, drawingg, start]);

  return (
    <div className="appContainer">
      <Navbar />
      <h1 className="title">Draw!</h1>
      <h1>Instruction: bafdasfhudashfkdsf</h1>
      {
        start ? <div>{countdown}</div>
        :
        <button onClick={startButtonHandler}>Start</button>
      }
      {start && drawingg ? (
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ border: '1px solid black' }}
        />
      ) : (
        <></>
      )}


      <div>
        {colorClasses.map(colorClass => (
          <div
            key={colorClass}
            className={`colorButton ${colorClass}`}
            onClick={() => handleColorChange(colorClass)}
          />
        ))}

        <img src="./delete.svg" alt="Delete" className="deleteButton" onClick={handleDelete} />
      </div>



      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Username Modal"
      >
        <h2>Enter Your Username</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={submitForm}>Submit</button>
      </Modal>
    </div>
  ); 
}
