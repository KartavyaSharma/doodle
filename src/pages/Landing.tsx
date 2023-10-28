import React from 'react'
const host = window.location.hostname

export default function Landing() {
  return (
    <button onClick={() => {
      window.location.href = `/drawing`
    }}>Single Play</button>
    
  )
}
