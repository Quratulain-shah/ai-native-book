import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CodeExample = ({
  code,
  language = 'python',
  title = 'Code Example',
  description = '',
  showLineNumbers = true,
  copyable = true
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLanguageClass = () => {
    const langMap = {
      python: 'language-python',
      javascript: 'language-javascript',
      typescript: 'language-typescript',
      cpp: 'language-cpp',
      c: 'language-c',
      rust: 'language-rust',
      shell: 'language-bash',
      json: 'language-json',
      yaml: 'language-yaml'
    };
    return langMap[language] || 'language-python';
  };

  return (
    <div className="glass-container" style={{
      margin: '1rem 0',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        background: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(0, 255, 255, 0.2)'
      }}>
        <div>
          <h4 style={{
            color: '#00ffff',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '1rem',
            margin: 0
          }}>
            {title}
          </h4>
          {description && (
            <p style={{
              color: '#a0a0a0',
              fontSize: '0.8rem',
              margin: '0.25rem 0 0 0'
            }}>
              {description}
            </p>
          )}
        </div>

        {copyable && (
          <button
            onClick={copyToClipboard}
            className="search-filter-btn"
            style={{
              fontSize: '0.8rem',
              padding: '0.25rem 0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        )}
      </div>

      <div className="circuit-hover" style={{
        position: 'relative',
        overflow: 'auto'
      }}>
        <pre className={`code-block ${getLanguageClass()}`} style={{
          margin: 0,
          borderRadius: 0,
          border: 'none',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          <code className={getLanguageClass()}>
            {code}
          </code>
        </pre>

        {showLineNumbers && (
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '40px',
            background: 'rgba(0, 0, 0, 0.3)',
            color: '#666',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            padding: '1rem 0',
            textAlign: 'center',
            userSelect: 'none'
          }}>
            {code.split('\n').map((_, index) => (
              <div key={index} style={{ lineHeight: '1.5' }}>
                {index + 1}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        padding: '0.5rem',
        background: 'rgba(0, 0, 0, 0.2)',
        fontSize: '0.75rem',
        color: '#808080',
        textAlign: 'right'
      }}>
        {language.toUpperCase()} • {code.split('\n').length} lines
      </div>
    </div>
  );
};

export default CodeExample;