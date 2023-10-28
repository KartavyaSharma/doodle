import { useRef, useState } from "react"
import "./Canvas.css"

const palette = ["#BB803B", "#EF8D8D", "#F6EC90", "#A5F2A8", "#9DA7F9", "#D098EA"]

function getMouse(e: React.MouseEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

export default function Canvas() {
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

    return (
        <canvas 
            id="canvas" 
            width={1024}
            height={1024}

            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
        />
    )
}
