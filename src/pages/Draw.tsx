import React, { useRef, useState } from 'react';
import Modal from '@/components/modal';
import './Draw.css';
import Button from '@/components/button';

const prompt = "an air fryer";
const SEND_IMG_URL = import.meta.env.VITE_CONVEX_SITE_URL;

const colors = ["#BB803B", "#EF8D8D", "#F6EC90", "#A5F2A8", "#9DA7F9", "#D098EA"];

function getMouse(e: React.MouseEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

enum PageSection {
  Start,
  Instructions,
  Countdown,
  Draw,
  Submit
}

export default function Drawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSection, setCurrentSection] = useState<PageSection>(PageSection.Start)
  const [isDrawing, setIsDrawing] = useState(false)
  const [colorChoice, setColorChoice] = useState(colors[0]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [promptCountdown, setPromptCountdown] = useState(3);
  const [drawCountdown, setDrawCountdown] = useState(30);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [needUsername, setNeedUsername] = useState(false);
  
  const startDrawing: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
      if (currentSection != PageSection.Draw) return;

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

  const endDrawing: React.MouseEventHandler<HTMLCanvasElement> = (_) => {
      setIsDrawing(false);
  }

  const startPromptCountdown = () => {
    setCurrentSection(PageSection.Countdown)

    for (let i = 0; i < promptCountdown; i++) {
      setTimeout(() => {
        setPromptCountdown(promptCountdown - i - 1);
      }, 1000 * (i + 1));
    }

    setTimeout(() => {
      startDrawCountdown();
    }, 1000 * promptCountdown);
  }

  const startDrawCountdown = () => {
    setCurrentSection(PageSection.Draw)

    for (let i = 0; i < drawCountdown; i++) {
      setTimeout(() => {
        setDrawCountdown(drawCountdown - i - 1);
      }, 1000 * (i + 1));
    }

    setTimeout(() => {
      setCurrentSection(PageSection.Submit);
      saveDrawing();
    }, 1000 * drawCountdown);
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current as HTMLCanvasElement

    canvas.toBlob((blob) => {
      setSelectedImage(blob);
    })
  }

  const submitForm = () => {
    if (!username) {
      setNeedUsername(true);
      return;
    }

    if (selectedImage) {
      fetch(SEND_IMG_URL + "/sendImage" + "?author=" + username, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      }).then(() => {
        console.log("Sent Image with username:", username);
        window.location.href = `/gallery`;
      }).catch((err) => {
        console.log(err)
      });
    }
  };

  const handleClear = () => {
    setClearModalOpen(false)

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <>
    { (currentSection == PageSection.Draw || currentSection == PageSection.Submit) &&
      <div id="drawHeader">
        <div id="drawLeft">
          <img id="drawLogo" src="./logo.svg" alt="Logo"/>
          <div id="drawPrompt">{prompt}</div>
        </div>

        <div id="drawCountdown">{drawCountdown}</div>
      </div>
    }

    { clearModalOpen && (
      <Modal onClickOut={() => setClearModalOpen(false)}>
        <div className="closeModal">
          <h2 style={{textAlign: "center"}}>Clear entire canvas?</h2>
          <div className="closeOptions">
            <Button onClick={() => setClearModalOpen(false)}><img src="./x.svg" alt="cancel" /></Button>
            <Button onClick={handleClear} color='red'><img src="./check.svg" alt="confirm" /></Button>
          </div>
        </div>
      </Modal>
    )}

    <div id="drawPage"> 
      <div id="canvasContainer">
        <div id="canvas">
          { currentSection == PageSection.Start && (<>
            <h1 className='logo-with-text'><span>A new</span> <img src='./logo.svg' alt='Logo' className='logo-in-text' /></h1>
            <h1>every day</h1>
            <h1>across the world</h1>
            <br/>
            <Button onClick={() => setCurrentSection(PageSection.Instructions)}>draw!</Button>
          </>)}

          { currentSection == PageSection.Instructions && (<>
            <h2>Draw a picture representing the prompt!</h2>
            <h2>You will have 3s to read the prompt, and then 30s to draw.</h2>
            <br/>
            <Button fontSize="24px" onClick={startPromptCountdown}>I'm ready</Button>
          </>)}

          { currentSection == PageSection.Countdown &&
            <>
              <img src="./logo.svg" alt="Logo"/>
              <h1>{prompt}</h1>
              <div id="promptCountdown">{promptCountdown}</div>
            </>
          }

          { (currentSection == PageSection.Draw || currentSection == PageSection.Submit) &&
            <canvas
              width={512}
              height={768}
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
            />
          }

          { currentSection == PageSection.Submit &&
            <Modal>
              <div className='submitModal'>
                <h1>Time's up!</h1>
                <p>Please enter a username to submit.</p>
                <input className={needUsername ? "redBorder" : ""} type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
                <Button onClick={submitForm} fontSize='20px'>Submit!</Button>
              </div>
            </Modal>
          }  
        </div>
      </div>

      <div id="colorPicker">
        { (currentSection == PageSection.Draw || currentSection == PageSection.Submit) &&
          <>
            <div className="colors">
              {colors.map((color) => (
                <div 
                  key={color} 
                  className={' colorButton ' + (colorChoice == color ? ' colorButtonSelected' : '')} 
                  style={{backgroundColor: color}}
                  onClick={() => setColorChoice(color)}
                /> 
              ))}
            </div>

            <img src="./delete.svg" alt="delete" onClick={() => setClearModalOpen(true)}/>
          </>
        }
      </div>
    </div>
    </>
  );
}
