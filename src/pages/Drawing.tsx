import React, { useRef, useEffect, useState } from 'react';
// import './App.css';

const TIMEFORDRAWING = 5;
const SEND_IMG_URL = ""
const host = window.location.hostname

export default function Drawing() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState(false);
  const [drawingg, setDrawing] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const startButtonHandler = () => {
    setStart(true);
  };

  useEffect(() => {
    if (start) {
      setTimeout(() => {
        setDrawing(false);
        canvasRef.current.toBlob((blob) => {
          setSelectedImage(blob);
        });
      }, TIMEFORDRAWING * 1000); // Convert seconds to milliseconds
    }
  }, [start]);

  useEffect(() => {

    if (selectedImage) {
      console.log("Sent Image")
      fetch(SEND_IMG_URL, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage, 
      }).then(() => {
        window.location.href = `/gallery`
      })
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
      <button onClick={startButtonHandler}>Start</button>
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
    </div>
  ); 
}
