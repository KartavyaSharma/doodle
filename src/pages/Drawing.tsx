import { useRef, useEffect, useState } from 'react';

// import './App.css';
import Modal from 'react-modal';

const TIMEFORDRAWING = 5;
const SEND_IMG_URL = import.meta.env.VITE_CONVEX_SITE_URL
// const host = window.location.hostname

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
      fetch(SEND_IMG_URL+"/sendImage"+"?author="+username, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage, 
      }).then(() => {
        console.log("Sent Image with username:", username);
        window.location.href = `/gallery`;
      }).catch(() => {
        // window.location.href = `/gallery`;
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
