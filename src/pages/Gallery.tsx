
import { useConvex } from 'convex/react'
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

    const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!props.draggable) return

        setIsDragging(true)
    }

    const drag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!isDragging) return

        if (mouseStart.length === 0) {
            setMouseStart([e.clientX, e.clientY])
        }

        const deltaX = e.clientX - mouseStart[0]
        const deltaY = e.clientY - mouseStart[1]
        setPos([deltaX, deltaY])

        const deltaAngle = deltaX / 20

        setAngle(initialAngle + deltaAngle)
    }

    const endDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const deltaX = e.clientX - mouseStart[0]
        const deltaY = e.clientY - mouseStart[1]

        const deltaPos = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        if (deltaPos > 100) {
            const x = deltaX / deltaPos * (window.innerWidth + window.innerHeight)
            const y = deltaY / deltaPos * (window.innerWidth + window.innerHeight)

            setPos([x, y])
            
            props.swiped()
        } else {
            setPos([0, 0])
            setAngle(initialAngle)    

            setIsDragging(false)
            setMouseStart([])    
        }
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
        >
            <img className="drawing" src={props.url} alt='drawing'/>
        </div>
    )
}

export default function Gallery() {
  const client = useConvex()
  const [drawings, setDrawings] = useState<any[]>([])

  //initial
  useEffect(() => {
    client.query(api.functions.list, {limit: 3})
        .then((result) => {
          setDrawings(result)
        })
  }, [])

  const nextDrawing = () => {
    setDrawings(drawings.slice(1))
    client.query(api.functions.list, {limit: 1})
        .then((result) => {
          setDrawings([...drawings, ...result])
          console.log(drawings)
        })
  }

  return (
    <>
    {drawings.reverse().map((doodle, index) => (
      <Drawing key={doodle.url} url={doodle.url} draggable={index == drawings.length - 1} swiped={nextDrawing} />
    ))}
    </>
  )
}
