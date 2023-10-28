import { api } from '../../convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

export default function Gallery() {
  const images = useQuery(api.functions.list, )
  
  return (
    <div>{JSON.stringify(images)}</div>

  )
}
