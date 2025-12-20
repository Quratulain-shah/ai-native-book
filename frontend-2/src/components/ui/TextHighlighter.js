import React, { useState, useEffect, useRef } from 'react';

const TextHighlighter = ({ children }) => {
  const [highlights, setHighlights] = useState([]);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef(null);

  useEffect(() => {
    // Load saved highlights from localStorage
    const savedHighlights = localStorage.getItem('book-highlights');
    if (savedHighlights) {
      setHighlights(JSON.parse(savedHighlights));
    }
  }, []);

  useEffect(() => {
    // Save highlights to localStorage
    localStorage.setItem('book-highlights', JSON.stringify(highlights));
  }, [highlights]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setMenuPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY - 40
      });
      setShowHighlightMenu(true);
    } else {
      setShowHighlightMenu(false);
    }
  };

  const addHighlight = (color) => {
    const selection = window.getSelection();
    if (selection.toString().trim() && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();
      const highlightId = Date.now();

      // Wrap the selected text in a highlight span
      const span = document.createElement('span');
      span.className = `highlight-${color} circuit-hover`;
      span.dataset.highlightId = highlightId;
      span.dataset.highlightColor = color;

      try {
        range.surroundContents(span);

        // Store highlight information
        const newHighlight = {
          id: highlightId,
          text: selectedText,
          color: color,
          page: window.location.pathname,
          timestamp: Date.now()
        };

        setHighlights(prev => [...prev, newHighlight]);

        setShowHighlightMenu(false);
        selection.removeAllRanges();
      } catch (error) {
        console.error('Error adding highlight:', error);
        // Fallback: create a new range and try again
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);

        const newHighlight = {
          id: highlightId,
          text: selectedText,
          color: color,
          page: window.location.pathname,
          timestamp: Date.now()
        };

        setHighlights(prev => [...prev, newHighlight]);

        setShowHighlightMenu(false);
        selection.removeAllRanges();
      }
    }
  };

  const removeHighlight = (id) => {
    const element = document.querySelector(`[data-highlight-id="${id}"]`);
    if (element) {
      const textNode = document.createTextNode(element.textContent);
      element.parentNode.replaceChild(textNode, element);
      setHighlights(prev => prev.filter(h => h.id !== id));
    }
  };

  const clearAllHighlights = () => {
    // Remove all highlight spans and restore original text
    const highlightElements = document.querySelectorAll('[data-highlight-id]');
    highlightElements.forEach(el => {
      const textNode = document.createTextNode(el.textContent);
      el.parentNode.replaceChild(textNode, el);
    });
    setHighlights([]);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, []);

  return (
    <div ref={contentRef} style={{ position: 'relative' }}>
      {children}

      {showHighlightMenu && (
        <div
          className="text-highlighter-pill glass-card"
          style={{
            position: 'fixed',
            left: menuPosition.x,
            top: menuPosition.y,
            zIndex: 10000,
            display: 'flex',
            gap: '4px',
            padding: '4px'
          }}
        >
          {['yellow', 'blue', 'green', 'pink'].map(color => (
            <button
              key={color}
              className={`highlight-button ${color}`}
              onClick={() => addHighlight(color)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                backgroundColor:
                  color === 'yellow' ? 'rgba(255, 215, 0, 0.5)' :
                  color === 'blue' ? 'rgba(0, 191, 255, 0.5)' :
                  color === 'green' ? 'rgba(50, 205, 50, 0.5)' :
                  'rgba(255, 105, 180, 0.5)',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {color.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Highlight management panel */}
      {highlights.length > 0 && (
        <div className="glass-container" style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          zIndex: 1000,
          padding: '0.5rem',
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#00ffff' }}>
            {highlights.length} highlight{highlights.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={clearAllHighlights}
            className="search-filter-btn"
            style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', marginTop: '0.25rem' }}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default TextHighlighter;