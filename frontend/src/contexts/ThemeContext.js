/**
 * Theme Context for the Robotics-themed UI
 * Manages theme state and provides theme-related utilities across the application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import ROBOTIC_COLORS from '../utils/colors';

const ThemeContext = createContext();

// Default theme configuration
const DEFAULT_THEME = {
  name: 'robotic-dark',
  mode: 'dark',
  primaryColor: ROBOTIC_COLORS.primary,
  backgroundColor: ROBOTIC_COLORS.background,
  surfaceColor: ROBOTIC_COLORS.surface,
  accentColor: ROBOTIC_COLORS.accent,
  fontFamily: {
    base: 'Inter, system-ui, -apple-system, sans-serif',
    heading: 'Orbitron, sans-serif',
    monospace: 'JetBrains Mono, monospace'
  },
  animation: {
    enabled: true,
    scanline: true,
    glitch: true
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false
  }
};

// Night-vision theme variant
const NIGHT_VISION_THEME = {
  ...DEFAULT_THEME,
  name: 'night-vision',
  primaryColor: '#00ff00', // Green for night vision
  backgroundColor: '#001100', // Dark green background
  surfaceColor: '#002200', // Darker green surface
  accentColor: '#008800' // Accent green
};

export const ThemeProvider = ({ children, initialTheme = DEFAULT_THEME }) => {
  const [theme, setTheme] = useState(initialTheme);
  const [themeName, setThemeName] = useState(initialTheme.name);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;

    // Set CSS custom properties
    root.style.setProperty('--ifm-color-primary', theme.primaryColor);
    root.style.setProperty('--ifm-background-color', theme.backgroundColor);
    root.style.setProperty('--ifm-background-surface-color', theme.surfaceColor);
    root.style.setProperty('--robotic-accent-color', theme.accentColor);
    root.style.setProperty('--ifm-font-family-base', theme.fontFamily.base);
    root.style.setProperty('--ifm-font-family-heading', theme.fontFamily.heading);
    root.style.setProperty('--ifm-font-family-monospace', theme.fontFamily.monospace);

    // Add theme class to body for CSS targeting
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme.name}`);
  }, [theme]);

  // Theme switching functions
  const switchToRoboticTheme = () => {
    setTheme(DEFAULT_THEME);
    setThemeName(DEFAULT_THEME.name);
  };

  const switchToNightVisionTheme = () => {
    setTheme(NIGHT_VISION_THEME);
    setThemeName(NIGHT_VISION_THEME.name);
  };

  const updateTheme = (newTheme) => {
    setTheme(prev => ({ ...prev, ...newTheme }));
  };

  const toggleAnimations = () => {
    setTheme(prev => ({
      ...prev,
      animation: {
        ...prev.animation,
        enabled: !prev.animation.enabled
      }
    }));
  };

  const toggleAccessibilityOption = (option) => {
    setTheme(prev => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [option]: !prev.accessibility[option]
      }
    }));
  };

  const value = {
    theme,
    themeName,
    switchToRoboticTheme,
    switchToNightVisionTheme,
    updateTheme,
    toggleAnimations,
    toggleAccessibilityOption,
    colors: ROBOTIC_COLORS
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Higher-order component to wrap components with theme context
export const withTheme = (Component) => {
  return (props) => (
    <ThemeContext.Consumer>
      {context => <Component {...props} themeContext={context} />}
    </ThemeContext.Consumer>
  );
};

export default ThemeContext;