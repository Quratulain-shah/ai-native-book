/**
 * Accessibility utilities for the Robotics-themed UI
 * Ensures WCAG AA compliance and proper accessibility for the futuristic theme
 */

// Check contrast ratios for WCAG AA compliance (minimum 4.5:1 for normal text)
export const checkContrastRatio = (foregroundColor, backgroundColor) => {
  const fgRgb = hexToRgb(foregroundColor);
  const bgRgb = hexToRgb(backgroundColor);

  const fgLuminance = calculateLuminance(fgRgb);
  const bgLuminance = calculateLuminance(bgRgb);

  const brightest = Math.max(fgLuminance, bgLuminance);
  const darkest = Math.min(fgLuminance, bgLuminance);

  const ratio = (brightest + 0.05) / (darkest + 0.05);

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7.0
  };
};

// Convert hex color to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Calculate luminance for contrast ratio
const calculateLuminance = (rgb) => {
  const a = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Ensure proper focus indicators for keyboard navigation
export const ensureFocusIndicator = (element) => {
  if (element) {
    element.style.outline = '2px solid #00ffff'; // Neon cyan focus indicator
    element.style.outlineOffset = '2px';
    element.style.borderRadius = '2px';
  }
};

// ARIA utilities for screen readers
export const generateAriaLabel = (element, baseLabel) => {
  const role = element?.getAttribute?.('role') || '';
  const type = element?.type || element?.tagName?.toLowerCase() || '';

  let label = baseLabel;
  if (role) label += ` (${role})`;
  if (type && !role) label += ` ${type}`;

  return label;
};

// Check if an element is properly labeled for accessibility
export const isElementAccessible = (element) => {
  if (!element) return false;

  // Check for proper labeling
  const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
  const hasTitle = element.hasAttribute('title');
  const hasLabel = element.tagName.toLowerCase() === 'input' &&
                   (element.id && document.querySelector(`label[for="${element.id}"]`));

  // Check for proper contrast if it's a visible element
  const computedStyle = window.getComputedStyle ? window.getComputedStyle(element) : null;
  const color = computedStyle ? computedStyle.color : null;
  const backgroundColor = computedStyle ? computedStyle.backgroundColor : null;

  let contrastOk = true;
  if (color && backgroundColor) {
    const contrast = checkContrastRatio(color, backgroundColor);
    contrastOk = contrast.passesAA;
  }

  return (hasAriaLabel || hasTitle || hasLabel) && contrastOk;
};

// Focus management utilities
export const focusFirstInteractiveElement = (container) => {
  if (!container) return;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
};

// Announce messages to screen readers
export const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.position = 'absolute';
  announcement.style.left = '-9999px';
  announcement.style.top = '0';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Validate accessibility of the robotic color scheme
export const validateRoboticColorAccessibility = () => {
  const colorsToTest = [
    { fg: '#00ffff', bg: '#1a1a1a', name: 'Neon Cyan on Charcoal' }, // Primary text
    { fg: '#e0e0e0', bg: '#222222', name: 'Light Gray on Surface' }, // Regular text
    { fg: '#00ffff', bg: 'rgba(34, 34, 34, 0.8)', name: 'Neon Cyan on Glass Navbar' }, // Navbar links
  ];

  const results = colorsToTest.map(colorPair => ({
    ...colorPair,
    contrast: checkContrastRatio(colorPair.fg, colorPair.bg)
  }));

  return results;
};

export default {
  checkContrastRatio,
  ensureFocusIndicator,
  generateAriaLabel,
  isElementAccessible,
  focusFirstInteractiveElement,
  announceToScreenReader,
  validateRoboticColorAccessibility
};