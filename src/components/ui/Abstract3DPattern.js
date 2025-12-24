import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Abstract3DPattern = ({ className = '', style = {}, patternType = 'particles', size = 'large' }) => {
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const patternTypes = {
    particles: {
      count: size === 'large' ? 50 : 25,
      colors: ['#00ffff', '#009999', '#00cccc', '#33ffff'],
      shapes: ['circle', 'square', 'triangle'],
      minSize: size === 'large' ? 2 : 1,
      maxSize: size === 'large' ? 8 : 4
    },
    grid: {
      count: size === 'large' ? 100 : 50,
      colors: ['#00ffff', '#009999'],
      shapes: ['line'],
      minSize: 1,
      maxSize: 2
    },
    network: {
      count: size === 'large' ? 30 : 15,
      colors: ['#00ffff', '#ff00ff', '#009999'],
      shapes: ['circle'],
      minSize: 2,
      maxSize: 6
    }
  };

  const currentPattern = patternTypes[patternType] || patternTypes.particles;

  useEffect(() => {
    const newParticles = Array.from({ length: currentPattern.count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (currentPattern.maxSize - currentPattern.minSize) + currentPattern.minSize,
      color: currentPattern.colors[Math.floor(Math.random() * currentPattern.colors.length)],
      shape: currentPattern.shapes[Math.floor(Math.random() * currentPattern.shapes.length)],
      speed: Math.random() * 2 + 0.5,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.5 + 0.1
    }));
    setParticles(newParticles);
  }, [patternType, size]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const getParticleElement = (particle) => {
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - particle.x, 2) + Math.pow(mousePosition.y - particle.y, 2)
    );
    const isClose = distance < 20;

    const baseStyle = {
      position: 'absolute',
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      backgroundColor: particle.color,
      opacity: particle.opacity + (isClose ? 0.3 : 0),
      transition: 'all 0.3s ease',
      transform: `rotate(${particle.rotation}deg)`,
      borderRadius: particle.shape === 'circle' ? '50%' : particle.shape === 'triangle' ? '0' : '0',
      clipPath: particle.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
      filter: isClose ? 'blur(0px)' : 'blur(0.5px)',
      zIndex: isClose ? 10 : 1
    };

    if (particle.shape === 'line') {
      return (
        <div
          key={particle.id}
          style={{
            ...baseStyle,
            width: '2px',
            height: '20px',
            transform: `rotate(${Math.random() * 360}deg)`,
            background: `linear-gradient(to bottom, transparent, ${particle.color}, transparent)`
          }}
        />
      );
    }

    return (
      <motion.div
        key={particle.id}
        style={baseStyle}
        animate={{
          x: isClose ? (mousePosition.x - particle.x) * 0.1 : 0,
          y: isClose ? (mousePosition.y - particle.y) * 0.1 : 0,
          scale: isClose ? 1.5 : 1,
          opacity: particle.opacity + (isClose ? 0.3 : 0)
        }}
        transition={{ duration: 0.3 }}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={`abstract-3d-pattern ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -1,
        ...style
      }}
    >
      {particles.map(getParticleElement)}

      {/* Add a subtle grid overlay for some patterns */}
      {patternType === 'grid' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            opacity: 0.3
          }}
        />
      )}
    </div>
  );
};

export default Abstract3DPattern;