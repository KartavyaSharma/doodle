
import { usePaginatedQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../convex/_generated/api'
import "./Gallery.css"

const maxAngle = 8

function Drawing(props: { url: string, draggable: boolean, swiped: () => void }) {
    const [initialAngle, _] = useState(() => Math.random() * (maxAngle * 2) - maxAngle)
    const [angle, setAngle] = useState(initialAngle)

    const [isDragging, setIsDragging] = useState(false)
    const [mouseStart, setMouseStart] = useState<number[]>([])
    const [pos, setPos] = useState([0, 0])

    const startDrag = () => {
        if (!props.draggable) return

        setIsDragging(true)
    }

    const drag = (e: any) => {
        if (!isDragging) return

        if (mouseStart.length === 0) {
            setMouseStart([e.clientX, e.clientY])
        } else {
            const deltaX = e.clientX - mouseStart[0]
            const deltaY = e.clientY - mouseStart[1]
            setPos([deltaX, deltaY])

            const deltaAngle = deltaX / 20

            setAngle(initialAngle + deltaAngle)
        }        
    }

    const endDrag = (e: any) => {
        const deltaX = e.clientX - mouseStart[0]
        const deltaY = e.clientY - mouseStart[1]

        const deltaPos = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        if (deltaPos > 100) {
            const x = deltaX / deltaPos * (window.innerWidth + window.innerHeight) * 2
            const y = deltaY / deltaPos * (window.innerWidth + window.innerHeight) * 2

            setPos([x, y])
            
            setTimeout(props.swiped, 1000)
        } else {
            setPos([0, 0])
            setAngle(initialAngle)    
        }

        setIsDragging(false)
        setMouseStart([])
    }

    return (
        <div 
            className="drawing-container" 
            style={{
                transition: isDragging ? '' : 'all 0.5s',
                transform: `rotate(` + angle + 'deg)',
                left: pos[0],
                right: -pos[0],
                top: pos[1],
                bottom: -pos[1],
            }} 
            onMouseDown={startDrag}
            onMouseMove={drag}
            onMouseUp={endDrag}
            onTouchStart={startDrag}
            onTouchMove={(e) => drag(e.touches[0])}
            onTouchEnd={(e) => endDrag(e.changedTouches[0])}
        >
            <img className="drawing" src={props.url} alt='drawing'/>
        </div>
    )
}

export default function Gallery() {
    const { results } = usePaginatedQuery(api.functions.list as any, {}, { initialNumItems: 5 });
    const [currentIndex, setCurrentIndex] = useState(0);  // State to keep track of the current index

    const nextDrawing = () => {
      console.log("swiped");
      setCurrentIndex(prevIndex => (prevIndex + 1) % results.length);  // Increment and wrap around
    }
  
    return (
        <>
        <div id="gallery">
            <div id="galleryInfo">
                <h1>Gallery</h1>
                <p>"an air fryer"</p>
                <p>(10/29)</p>
            </div>

            <div id='galleryImages'>
                { results.length > 2 &&
                    <Drawing key={(currentIndex + 2) % results.length} url={results[(currentIndex + 2) % results.length]?.url} draggable={false} swiped={nextDrawing} />
                }
                { results.length > 1 &&
                    <Drawing key={(currentIndex + 1) % results.length} url={results[(currentIndex + 1) % results.length]?.url} draggable={false} swiped={nextDrawing} />
                }
                
                { results.length > 0 &&
                    <Drawing key={currentIndex} url={results[currentIndex]?.url} draggable={true} swiped={nextDrawing} />
                }
            </div>

            <div id="galleryUserContainer">
                <div id="galleryUser">
                    <p>{results[currentIndex]?.author}</p>
                    {/* <img src='./heart.svg' alt='heart' /> */}
                </div>
            </div>
        </div>
        </>
    )
}
