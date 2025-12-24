# Robotics Textbook - Glassmorphic UI Implementation

This directory contains the glassmorphic UI implementation for the AI Native Robotics Textbook.

## Components Structure

### Core Components
- `ui/`: Reusable UI components with glassmorphism styling
- `docusaurus/`: Docusaurus theme overrides
- `contexts/`: React context providers
- `hooks/`: Custom React hooks for UI functionality

### Key Features Implemented

1. **Glassmorphism Styling**
   - Custom CSS with backdrop-filter effects
   - Responsive glass containers and cards
   - Dark/light mode support

2. **Interactive Reading Features**
   - Text highlighting with color options
   - Selection-based interaction
   - Persistent highlight management

3. **Advanced UI Components**
   - BookReader: Interactive book reading experience
   - TableOfContents: Dynamic navigation
   - RoboticsDiagram: Interactive robot visualizations
   - CodeExample: Syntax-highlighted code blocks
   - ExerciseBox: Interactive exercises with solutions
   - HardwareSpecs: Hardware specification displays

4. **3D Visualizations**
   - Abstract3DPattern: Dynamic particle systems
   - Advanced3DVisualization: Kinematics, neural networks, trajectories
   - BackgroundEffects: Comprehensive background enhancements

5. **Theme Integration**
   - Custom Docusaurus theme overrides
   - CSS module approach for scoped styles
   - Context providers for state management
   - Hooks for interactive functionality

## Installation Requirements

- framer-motion: For animations and transitions
- Docusaurus: Core documentation framework
- React: Frontend framework

## Custom CSS Classes

- `.glass-container`: Basic glass effect container
- `.glass-card`: Elevated glass card element
- `.interactive-reading`: Container for interactive features
- `.abstract-3d-pattern`: Background decorative elements
- `.physical-ai-header`: Specialized header styling
- `.exercise-box`: Exercise containers
- `.hardware-specs`: Hardware specification displays

## Theme Integration

The glassmorphism theme is integrated through:
- Custom Docusaurus theme overrides
- CSS module approach for scoped styles
- Context providers for state management
- Hooks for interactive functionality

## Animation and Interactions

- Framer Motion for smooth animations
- Mouse tracking for interactive effects
- Hover states with enhanced visual feedback
- Page transition animations
- Particle system interactions

## Responsive Design

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interactions
- Accessible design patterns