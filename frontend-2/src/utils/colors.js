/**
 * Color utilities for the Robotics-themed UI
 * Provides consistent color values for the dark, industrial, futuristic theme
 */

// Primary theme colors
export const ROBOTIC_COLORS = {
  primary: '#00ffff', // Neon cyan
  primaryDark: '#00cccc',
  primaryDarker: '#00bbbb',
  primaryDarkest: '#009999',
  primaryLight: '#33ffff',
  primaryLighter: '#66ffff',
  primaryLightest: '#99ffff',
  background: '#1a1a1a', // Deep charcoal
  surface: '#222222',
  accent: '#ff00ff', // Neon pink/magenta
  glow: 'rgba(0, 255, 255, 0.3)',
};

// Highlight colors for text selection
export const HIGHLIGHT_COLORS = {
  important: '#ffff00', // Yellow
  definition: '#00ffff', // Blue/Cyan
  revision: '#00ff00', // Green
  question: '#ff00ff', // Pink/Magenta
};

// Status colors for different states
export const STATUS_COLORS = {
  success: '#00ff00',
  warning: '#ffff00',
  error: '#ff0000',
  info: '#0080ff',
  diagnostic: '#00ffff', // Neon cyan
};

// Theme utilities
export const getContrastColor = (backgroundColor) => {
  // Calculate luminance and return appropriate text color
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};

export const getTransparentColor = (color, alpha) => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const isValidColor = (color) => {
  // Check if color is a valid hex or rgba value
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbaPattern = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(,\s*[\d.]+)?\)$/;
  return hexPattern.test(color) || rgbaPattern.test(color);
};

export default ROBOTIC_COLORS;