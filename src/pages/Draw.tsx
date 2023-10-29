import React, { useRef, useEffect, useState } from 'react';
import Modal from 'react-modal';
import './Draw.css';

const TIMEFORDRAWING = 5;
const SEND_IMG_URL = import.meta.env.VITE_CONVEX_SITE_URL;
const host = window.location.hostname;

const palette = ["#BB803B", "#EF8D8D", "#F6EC90", "#A5F2A8", "#9DA7F9", "#D098EA"];

function getMouse(e: React.MouseEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}
const colorClasses = [
  'color-brown',
  'color-red',
  'color-yellow',
  'color-green',
  'color-blue',
  'color-purple'
];

const handleColorChange = (colorClass: string) => {
  // Handle color change logic here. This is a placeholder.
  console.log(`Color changed to ${colorClass}`);
};

const handleDelete = () => {
  // Handle the delete logic here. This is a placeholder.
  console.log("Delete button clicked");
};


export default function Drawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [colorChoice, setColorChoice] = useState(palette[0]);
  const startDrawing: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
      setIsDrawing(true);

      const ctx = e.currentTarget.getContext("2d");

      if (ctx) {
          const m = getMouse(e, canvasRef.current as HTMLCanvasElement);

          ctx.beginPath();
          ctx.lineWidth = 12;
          ctx.lineCap = "round";
          ctx.strokeStyle = colorChoice;
          ctx.moveTo(m.x, m.y);
        }
  }

  const draw: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
      if (!isDrawing) {
          return;
      }
      const ctx = e.currentTarget.getContext("2d");

      if (ctx) {
          const m = getMouse(e, canvasRef.current as HTMLCanvasElement);

          ctx.lineTo(m.x, m.y);
          ctx.stroke();
      }
  }

  const endDrawing: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
      setIsDrawing(false);
  }

  const [start, setStart] = useState(false);
  const [drawing, setDrawing] = useState(true);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [countdown, setCountDown] = useState(TIMEFORDRAWING);
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
      fetch(SEND_IMG_URL + "/sendImage" + "?author=" + username, {
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
    console.log(selectedImage, "!!!!!!!!");
  }, [selectedImage])


  const handleColorChange = (color: string) => {
    setColorChoice(color);
  };

  const handleDelete = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="appContainer">

      <h1 className="title">Draw!</h1>
      <h1>Instruction: Draw a picture representing the prompt!</h1>
      {
        start ? <div>{countdown}</div>
          :
          <button className='prompt-button' onClick={startButtonHandler}>draw!</button>
      }
      {start && drawing ? (
        <div>
          <canvas 
            id="canvas" 
            width={1024}
            height={1024}
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
        >
          </canvas>
          <div>
            {palette.map(color => (
              <div
                key={color}
                className="colorButton"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
            
            <img src="./delete.svg" alt="Delete" className="deleteButton" onClick={handleDelete} />
          </div>
        </div>
      ) : (
        <></>
      )}

<Modal isOpen={isModalOpen}
       onRequestClose={closeModal}
       contentLabel="Username Modal"
       overlayClassName="modal-overlay"
       className="modal-content"
>
  <center>
    <h2 className="text">Time's up!</h2>
    <p className="text">Please enter a username to submit.</p>
    <input
      type="text"
      defaultValue="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <br />
    <br />
    <button className='prompt-button' onClick={submitForm}>Submit!</button>
  </center>
</Modal>
    
    </div>
  );
}
