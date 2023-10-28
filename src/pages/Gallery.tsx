
import { useConvex } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Gallery() {
  const client = useConvex()
  const [doodles, setDoodles] = useState([])

  //initial
  useEffect(() => {
    client.query(api.functions.list, {limit: 3})
        .then((result) => {
          setDoodles(result)
        })
  }, [])

  const buttonClickNewPic = () => {
    client.query(api.functions.list, {limit: 1})
        .then((result) => {
          setDoodles(doodles.concat(result))
        })
  }

  return (
    <>
    <button onClick={buttonClickNewPic}></button>
    </>
  )
}
