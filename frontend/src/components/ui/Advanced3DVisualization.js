import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const Advanced3DVisualization = ({
  title = '3D Robotics Visualization',
  visualizationType = 'kinematics',
  data = null,
  autoRotate = true
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(autoRotate);
  const containerRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        setRotation(prev => ({
          x: prev.x + 0.5,
          y: prev.y + 0.3
        }));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [autoRotate]);

  const handleMouseMove = (e) => {
    if (containerRef.current && !autoRotate) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rotateY = ((e.clientX - centerX) / rect.width) * 30;
      const rotateX = ((e.clientY - centerY) / rect.height) * -30;

      setRotation({ x: rotateX, y: rotateY });
    }
  };

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'kinematics':
        return (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Robot arm visualization */}
            <div style={{
              position: 'relative',
              width: '150px',
              height: '150px'
            }}>
              {/* Base */}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '30px',
                height: '10px',
                background: 'linear-gradient(90deg, #00ffff, #009999)',
                borderRadius: '2px'
              }} />

              {/* Arm segments */}
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  width: '2px',
                  height: '60px',
                  background: 'linear-gradient(to top, #00ffff, #009999)',
                  transformOrigin: 'bottom center',
                  borderRadius: '1px'
                }}
                animate={{ rotate: rotation.y }}
              />

              <motion.div
                style={{
                  position: 'absolute',
                  bottom: '60px',
                  left: '50%',
                  width: '2px',
                  height: '40px',
                  background: 'linear-gradient(to top, #009999, #00ffff)',
                  transformOrigin: 'bottom center',
                  borderRadius: '1px'
                }}
                animate={{ rotate: rotation.y * 0.7 }}
              />

              {/* End effector */}
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: '95px',
                  left: '50%',
                  width: '10px',
                  height: '10px',
                  background: '#ff00ff',
                  borderRadius: '50%',
                  transform: 'translateX(-50%)'
                }}
                animate={{ rotate: rotation.y * 0.5 }}
              />
            </div>
          </div>
        );

      case 'neural':
        return (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Neural network visualization */}
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              {[0, 1, 2].map(layer => (
                <div key={layer} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {[0, 1, 2].map(neuron => (
                    <motion.div
                      key={`${layer}-${neuron}`}
                      className="circuit-hover"
                      style={{
                        width: '20px',
                        height: '20px',
                        background: 'radial-gradient(circle, #00ffff, #009999)',
                        borderRadius: '50%',
                        border: '2px solid #00ffff',
                        boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                      }}
                      animate={{
                        scale: Math.sin(Date.now() / 500 + layer * 2 + neuron) * 0.2 + 1,
                        opacity: Math.sin(Date.now() / 300 + layer * 3 + neuron) * 0.3 + 0.7
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );

      case 'trajectory':
        return (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Trajectory path */}
            <motion.svg
              width="150"
              height="150"
              viewBox="0 0 150 150"
              style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
            >
              <motion.path
                d="M 20 130 Q 75 30 130 130"
                stroke="#00ffff"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.circle
                cx="20"
                cy="130"
                r="5"
                fill="#ff00ff"
                animate={{
                  cx: ["20", "75", "130", "75", "20"],
                  cy: ["130", "30", "130", "80", "130"]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </motion.svg>
          </div>
        );

      default:
        return (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00ffff',
            fontFamily: 'Orbitron, sans-serif'
          }}>
            {title}
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className="glass-container"
      style={{
        padding: '1.5rem',
        margin: '1rem 0',
        minHeight: '250px',
        position: 'relative',
        overflow: 'hidden',
        cursor: !autoRotate ? 'grab' : 'default'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !autoRotate && setRotation({ x: 0, y: 0 })}
    >
      <h3 className="glitch" style={{ color: '#00ffff', fontFamily: 'Orbitron, sans-serif', marginBottom: '1rem' }}>
        {title}
      </h3>

      <div style={{ position: 'relative', width: '100%', height: '200px' }}>
        {renderVisualization()}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="search-filter-btn"
          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
        >
          {isRotating ? '⏸️ Pause' : '▶️ Play'}
        </button>

        <button
          onClick={() => setRotation({ x: 0, y: 0 })}
          className="search-filter-btn"
          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default Advanced3DVisualization;