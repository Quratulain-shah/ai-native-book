import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RoboticsDiagram = ({ title, description, diagramType = 'humanoid', interactive = true }) => {
  const [activePart, setActivePart] = useState(null);
  const [isInteractive, setIsInteractive] = useState(interactive);

  const robotParts = {
    humanoid: [
      { id: 'head', label: 'Head', position: { top: '10%', left: '45%' } },
      { id: 'torso', label: 'Torso', position: { top: '25%', left: '45%' } },
      { id: 'left-arm', label: 'Left Arm', position: { top: '25%', left: '30%' } },
      { id: 'right-arm', label: 'Right Arm', position: { top: '25%', left: '60%' } },
      { id: 'left-leg', label: 'Left Leg', position: { top: '55%', left: '40%' } },
      { id: 'right-leg', label: 'Right Leg', position: { top: '55%', left: '50%' } }
    ],
    quadruped: [
      { id: 'head', label: 'Head', position: { top: '15%', left: '25%' } },
      { id: 'torso', label: 'Torso', position: { top: '30%', left: '40%' } },
      { id: 'front-left-leg', label: 'Front Left Leg', position: { top: '45%', left: '30%' } },
      { id: 'front-right-leg', label: 'Front Right Leg', position: { top: '45%', left: '50%' } },
      { id: 'back-left-leg', label: 'Back Left Leg', position: { top: '60%', left: '35%' } },
      { id: 'back-right-leg', label: 'Back Right Leg', position: { top: '60%', left: '45%' } }
    ],
    wheeled: [
      { id: 'body', label: 'Main Body', position: { top: '35%', left: '35%' } },
      { id: 'front-left-wheel', label: 'Front Left Wheel', position: { top: '25%', left: '30%' } },
      { id: 'front-right-wheel', label: 'Front Right Wheel', position: { top: '25%', left: '60%' } },
      { id: 'back-left-wheel', label: 'Back Left Wheel', position: { top: '55%', left: '30%' } },
      { id: 'back-right-wheel', label: 'Back Right Wheel', position: { top: '55%', left: '60%' } },
      { id: 'sensor-array', label: 'Sensor Array', position: { top: '15%', left: '45%' } }
    ]
  };

  const currentParts = robotParts[diagramType] || robotParts.humanoid;

  return (
    <div className="glass-container" style={{
      padding: '1.5rem',
      margin: '1rem 0',
      minHeight: '400px',
      position: 'relative'
    }}>
      <h3 className="glitch" style={{ color: '#00ffff', fontFamily: 'Orbitron, sans-serif', marginBottom: '1rem' }}>
        {title}
      </h3>

      <p style={{ color: '#c0c0c0', marginBottom: '1rem' }}>{description}</p>

      <div style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        background: 'rgba(10, 10, 10, 0.5)',
        border: '1px solid rgba(0, 255, 255, 0.2)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />

        {/* Robot parts */}
        {currentParts.map((part) => (
          <motion.div
            key={part.id}
            className={`circuit-hover ${isInteractive ? 'search-filter-btn' : ''}`}
            style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              background: activePart === part.id ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 255, 255, 0.1)',
              border: activePart === part.id ? '2px solid #00ffff' : '1px solid rgba(0, 255, 255, 0.2)',
              borderRadius: '50%',
              cursor: isInteractive ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              ...part.position
            }}
            whileHover={isInteractive ? { scale: 1.1, backgroundColor: 'rgba(0, 255, 255, 0.2)' } : {}}
            onClick={() => isInteractive && setActivePart(activePart === part.id ? null : part.id)}
          >
            {part.label.charAt(0)}
          </motion.div>
        ))}

        {/* Interactive toggle */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setIsInteractive(!isInteractive)}
            className="search-filter-btn"
            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
          >
            {isInteractive ? 'Interactive: ON' : 'Interactive: OFF'}
          </button>
        </div>
      </div>

      {/* Part details panel */}
      <AnimatePresence>
        {activePart && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-container"
            style={{
              marginTop: '1rem',
              padding: '1rem',
              border: '1px solid rgba(0, 255, 255, 0.2)'
            }}
          >
            <h4 style={{ color: '#00ffff', marginBottom: '0.5rem' }}>
              {currentParts.find(p => p.id === activePart)?.label}
            </h4>
            <p style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
              Detailed information about this robot component would be displayed here.
              This includes specifications, functionality, and integration details.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoboticsDiagram;