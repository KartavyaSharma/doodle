
import { usePaginatedQuery } from 'convex/react'
import { useEffect, useState } from 'react'
import { api } from '../../convex/_generated/api'
import "./Gallery.css"

const maxAngle = 8

function Drawing(props: { url: string, draggable: boolean, swiped: () => void }) {
    const [initialAngle, _] = useState(() => Math.random() * (maxAngle * 2) - maxAngle)
    const [angle, setAngle] = useState(initialAngle)

    const [isDragging, setIsDragging] = useState(false)
    const [mouseStart, setMouseStart] = useState<number[]>([])
    const [pos, setPos] = useState([0, 0])

    const [opacity, setOpacity] = useState(0)

    useEffect(() => {
        setTimeout(() => {
            setOpacity(1)
        }, 100)
    })

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
            
            props.swiped()
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
                opacity: opacity
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
    const { results } = usePaginatedQuery(api.functions.list as any, {}, { initialNumItems: 20 });
    const [currentIndex, setCurrentIndex] = useState(0);  // State to keep track of the current index
    const [author, setAuthor] = useState('')
    const [hideUser, setHideUser] = useState(false)

    useEffect(() => {
        setAuthor(results[currentIndex]?.author)
    }, [results])

    const nextDrawing = () => {
        setHideUser(true)

        setTimeout(() => {
            setAuthor(results[(currentIndex + 1) % results.length]?.author)
            setHideUser(false)
        }, 250)

        setTimeout(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % results.length);  // Increment and wrap around
        }, 500);
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
                    <p style={{top: hideUser ? "100vh" : "0" }}>{author}</p>
                </div>
            </div>
        </div>
        </>
    )
}
