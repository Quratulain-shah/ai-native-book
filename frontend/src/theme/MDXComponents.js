import React from 'react';
import OriginalMDXComponents from '@theme-original/MDXComponents';
import { useThemeConfig } from '@docusaurus/theme-common';

// Custom Image component with target lock brackets
const TargetLockImage = (props) => {
  const { wrapperClassName, ...imageProps } = props;

  // Extract image attributes
  const {
    src,
    alt = '',
    width,
    height,
    className = '',
    style = {},
    ...restProps
  } = imageProps;

  // Apply target lock styling
  const targetLockStyle = {
    position: 'relative',
    display: 'inline-block',
    ...style
  };

  const bracketStyle = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    border: '2px solid #00ffff',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease'
  };

  return (
    <div className={`target-lock-container ${wrapperClassName || ''}`} style={targetLockStyle}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`target-lock-image ${className}`}
        style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        {...restProps}
      />
      {/* Top-left bracket */}
      <div className="target-bracket tl" style={{
        ...bracketStyle,
        top: '0',
        left: '0',
        borderTop: '2px solid #00ffff',
        borderLeft: '2px solid #00ffff',
        borderRadius: '2px 0 0 0'
      }}></div>

      {/* Top-right bracket */}
      <div className="target-bracket tr" style={{
        ...bracketStyle,
        top: '0',
        right: '0',
        borderTop: '2px solid #00ffff',
        borderRight: '2px solid #00ffff',
        borderRadius: '0 2px 0 0'
      }}></div>

      {/* Bottom-left bracket */}
      <div className="target-bracket bl" style={{
        ...bracketStyle,
        bottom: '0',
        left: '0',
        borderBottom: '2px solid #00ffff',
        borderLeft: '2px solid #00ffff',
        borderRadius: '0 0 0 2px'
      }}></div>

      {/* Bottom-right bracket */}
      <div className="target-bracket br" style={{
        ...bracketStyle,
        bottom: '0',
        right: '0',
        borderBottom: '2px solid #00ffff',
        borderRight: '2px solid #00ffff',
        borderRadius: '0 0 2px 0'
      }}></div>
    </div>
  );
};

// Add CSS for hover effects
const TargetLockCSS = () => (
  <style>
    {`
      .target-lock-container {
        position: relative;
        display: inline-block;
      }

      .target-lock-image {
        display: block;
        max-width: 100%;
        height: auto;
      }

      .target-bracket {
        position: absolute;
        width: 12px;
        height: 12px;
        box-sizing: border-box;
        transition: all 0.3s ease;
      }

      .target-bracket.tl {
        top: 0;
        left: 0;
        border-top: 2px solid #00ffff;
        border-left: 2px solid #00ffff;
        border-radius: 2px 0 0 0;
      }

      .target-bracket.tr {
        top: 0;
        right: 0;
        border-top: 2px solid #00ffff;
        border-right: 2px solid #00ffff;
        border-radius: 0 2px 0 0;
      }

      .target-bracket.bl {
        bottom: 0;
        left: 0;
        border-bottom: 2px solid #00ffff;
        border-left: 2px solid #00ffff;
        border-radius: 0 0 0 2px;
      }

      .target-bracket.br {
        bottom: 0;
        right: 0;
        border-bottom: 2px solid #00ffff;
        border-right: 2px solid #00ffff;
        border-radius: 0 0 2px 0;
      }

      .target-lock-container:hover .target-bracket {
        border-color: #00ff00; /* Glow effect on hover */
        box-shadow: 0 0 8px rgba(0, 255, 0, 0.8), 0 0 16px rgba(0, 255, 0, 0.4);
        transform: scale(1.2); /* Tighten effect */
      }

      .target-lock-container:hover .target-bracket.tl {
        top: -2px;
        left: -2px;
      }

      .target-lock-container:hover .target-bracket.tr {
        top: -2px;
        right: -2px;
      }

      .target-lock-container:hover .target-bracket.bl {
        bottom: -2px;
        left: -2px;
      }

      .target-lock-container:hover .target-bracket.br {
        bottom: -2px;
        right: -2px;
      }
    `}
  </style>
);

export default {
  ...OriginalMDXComponents,
  img: (props) => (
    <>
      <TargetLockCSS />
      <TargetLockImage {...props} />
    </>
  ),
};