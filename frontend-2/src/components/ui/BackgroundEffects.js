import React from 'react';
import Abstract3DPattern from './Abstract3DPattern';

const BackgroundEffects = () => {
  return (
    <>
      {/* Main background pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)'
      }} />

      {/* Abstract 3D particles overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.3
      }}>
        <Abstract3DPattern patternType="particles" size="large" />
      </div>

      {/* Subtle grid overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.1,
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />

      {/* Floating geometric shapes */}
      <div style={{
        position: 'fixed',
        top: '10%',
        right: '10%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
        filter: 'blur(20px)',
        zIndex: -1
      }} />

      <div style={{
        position: 'fixed',
        bottom: '20%',
        left: '15%',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(45deg, rgba(255, 0, 255, 0.1), transparent)',
        transform: 'rotate(45deg)',
        filter: 'blur(15px)',
        zIndex: -1
      }} />

      <div style={{
        position: 'fixed',
        top: '40%',
        left: '5%',
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), transparent)',
        borderRadius: '30px',
        filter: 'blur(10px)',
        zIndex: -1
      }} />

      {/* Scanline effect */}
      <div className="scanline" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1
      }} />
    </>
  );
};

export default BackgroundEffects;