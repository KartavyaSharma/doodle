import React, { useRef, useEffect, useState } from 'react';
import Modal from 'react-modal';
import './Drawing.css';

const TIMEFORDRAWING = 5;
const SEND_IMG_URL = "https://helpful-hornet-86.convex.site/sendImage";
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

const handleColorChange = (colorClass) => {
  // Handle color change logic here. This is a placeholder.
  console.log(`Color changed to ${colorClass}`);
};

const handleDelete = () => {
  // Handle the delete logic here. This is a placeholder.
  console.log("Delete button clicked");
};


export default function Drawing() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [colorChoice, setColorChoice] = useState(palette[0]);
    const [start, setStart] = useState(false);
    const [drawing, setDrawing] = useState(true);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [modalIsOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [countdown, setCountDown] = useState(TIMEFORDRAWING);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [username, setUsername] = useState('');

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
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const startDrawing = (e: React.MouseEvent) => {
            const m = getMouse(e, canvas);
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            setIsDrawing(true);
        };

        const draw = (e: React.MouseEvent) => {
            if (!isDrawing) return;
            const m = getMouse(e, canvas);
            ctx.lineWidth = 12;
            ctx.lineCap = "round";
            ctx.strokeStyle = colorChoice;
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
        };

        const endDrawing = () => {
            setIsDrawing(false);
        };

        canvas.addEventListener('mousedown', startDrawing as any);
        canvas.addEventListener('mousemove', draw as any);
        canvas.addEventListener('mouseup', endDrawing as any);
        canvas.addEventListener('mouseout', endDrawing as any);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing as any);
            canvas.removeEventListener('mousemove', draw as any);
            canvas.removeEventListener('mouseup', endDrawing as any);
            canvas.removeEventListener('mouseout', endDrawing as any);
        };
    }, [isDrawing, colorChoice]);

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
        <button onClick={startButtonHandler}>Start</button>
      }
      {start && drawing ? (
        <div>
          <canvas ref={canvasRef} width={800} height={600}></canvas>
            <div>
                {palette.map(color => (
                    <div
                        key={color}
                        className="colorButton"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                    />
                ))}
                <button onClick={handleDelete}>        <img src="./delete.svg" alt="Delete" className="deleteButton" onClick={handleDelete} />
</button>
            </div>
        </div>
      ) : (
        <></>
      )}

            <Modal isOpen={modalIsOpen}
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
