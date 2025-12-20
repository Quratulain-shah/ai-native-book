/**
 * Blueprint Background Component
 * Creates a blueprint grid pattern background for the robotics-themed UI
 */

import React from 'react';
import './styles.css';

const BlueprintBackground = ({
  children,
  className = '',
  style = {},
  gridOpacity = 0.05,
  gridSpacing = 20,
  gridColor = '#00ffff',
  show = true
}) => {
  if (!show) {
    return <div className={className} style={style}>{children}</div>;
  }

  const backgroundStyle = {
    backgroundImage: `
      linear-gradient(${gridColor}${Math.floor(gridOpacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px),
      linear-gradient(90deg, ${gridColor}${Math.floor(gridOpacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px)
    `,
    backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
    ...style
  };

  return (
    <div
      className={`blueprint-background ${className}`}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
};

// Alternative implementation using CSS classes for more control
export const BlueprintBackgroundLayer = ({
  children,
  className = '',
  style = {},
  variant = 'default', // 'default', 'dense', 'sparse', 'glow'
  intensity = 'normal' // 'subtle', 'normal', 'strong'
}) => {
  const intensityMap = {
    subtle: 0.03,
    normal: 0.05,
    strong: 0.08
  };

  const spacingMap = {
    default: 20,
    dense: 10,
    sparse: 40
  };

  const opacity = intensityMap[intensity] || intensityMap.normal;
  const spacing = spacingMap[variant] || spacingMap.default;

  const backgroundStyle = {
    backgroundImage: `
      linear-gradient(rgba(0, 255, 255, ${opacity}) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, ${opacity}) 1px, transparent 1px)
    `,
    backgroundSize: `${spacing}px ${spacing}px`,
    position: 'relative',
    ...style
  };

  // Add glow effect for 'glow' variant
  if (variant === 'glow') {
    backgroundStyle.boxShadow = `inset 0 0 50px rgba(0, 255, 255, 0.1)`;
  }

  return (
    <div
      className={`blueprint-background-layer ${className}`}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
};

// Blueprint overlay component for specific areas
export const BlueprintOverlay = ({
  className = '',
  style = {},
  opacity = 0.1,
  spacing = 15
}) => {
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    backgroundImage: `
      linear-gradient(rgba(0, 255, 255, ${opacity}) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, ${opacity}) 1px, transparent 1px)
    `,
    backgroundSize: `${spacing}px ${spacing}px`,
    zIndex: 1,
    ...style
  };

  return <div className={`blueprint-overlay ${className}`} style={overlayStyle} />;
};

// Blueprint grid pattern as a CSS-in-JS utility
export const blueprintGridPattern = (options = {}) => {
  const {
    color = '#00ffff',
    opacity = 0.05,
    spacing = 20,
    glow = false
  } = options;

  const hexOpacity = Math.floor(opacity * 255).toString(16).padStart(2, '0');
  const pattern = `
    linear-gradient(${color}${hexOpacity} 1px, transparent 1px),
    linear-gradient(90deg, ${color}${hexOpacity} 1px, transparent 1px)
  `;

  const styles = {
    backgroundImage: pattern,
    backgroundSize: `${spacing}px ${spacing}px`
  };

  if (glow) {
    styles.boxShadow = `inset 0 0 30px rgba(0, 255, 255, 0.05)`;
  }

  return styles;
};

export default BlueprintBackground;