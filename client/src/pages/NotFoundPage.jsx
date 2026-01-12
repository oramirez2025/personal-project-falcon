import React from 'react'
import DeathPage from '../assets/DeathPage.jpeg'

export default function NotFoundPage() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${DeathPage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Text in top-left */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
        }}
      >
        <h1
          style={{
            fontSize: '6vw', // large, scales with viewport
            color: '#000', // black text
            margin: 0,
            textShadow: '2px 2px 8px rgba(255,255,255,0.5)', // optional: pop effect
          }}
        >
          404
        </h1>
        <p
          style={{
            fontSize: '1.5vw',
            color: '#000',
            textShadow: '1px 1px 5px rgba(255,255,255,0.5)',
            margin: 0,
          }}
        >
          Page not found. Only Death awaits.
        </p>
      </div>
    </div>
  )
}
