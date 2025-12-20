import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BookReader = ({ children, currentPage, totalPages, onPageChange }) => {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [bookProgress, setBookProgress] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef(null);

  useEffect(() => {
    setBookProgress((currentPage / totalPages) * 100);
  }, [currentPage, totalPages]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(selection.toString());
      setMenuPosition({ x: rect.left, y: rect.top - 40 });
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

      const span = document.createElement('span');
      span.className = `highlight-${color} circuit-hover`;
      span.dataset.highlightId = highlightId;
      range.surroundContents(span);

      // For now, we'll just log the highlight - in a real implementation
      // this would save to local storage or send to a backend
      console.log('Highlight added:', {
        id: highlightId,
        text: selectedText,
        color: color,
        page: window.location.pathname
      });

      setShowHighlightMenu(false);
      selection.removeAllRanges();
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        onPageChange(currentPage + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const prevPage = () => {
    if (currentPage > 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        onPageChange(currentPage - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, []);

  return (
    <div className="glass-container book-reader-container" style={{
      minHeight: '600px',
      padding: '2rem',
      margin: '1rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Book Cover/Title */}
      <div className="physical-ai-header" style={{ marginBottom: '2rem' }}>
        <h1 className="glitch" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Physical AI & Humanoid Robotics
        </h1>
        <p style={{ color: '#a0a0a0', marginBottom: '0' }}>Interactive Textbook Reader</p>
      </div>

      {/* Book Progress */}
      <div className="circuit-hover" style={{
        height: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        marginBottom: '1rem',
        overflow: 'hidden'
      }}>
        <div
          className="scanline"
          style={{
            height: '100%',
            width: `${bookProgress}%`,
            background: 'linear-gradient(90deg, #00ffff, #009999)',
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      {/* Page Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0.5rem',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '4px'
      }}>
        <button
          onClick={prevPage}
          disabled={currentPage <= 1 || isFlipping}
          className="search-filter-btn"
          style={{ opacity: currentPage <= 1 || isFlipping ? 0.5 : 1 }}
        >
          ← Previous
        </button>

        <span style={{ color: '#00ffff', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages || isFlipping}
          className="search-filter-btn"
          style={{ opacity: currentPage >= totalPages || isFlipping ? 0.5 : 1 }}
        >
          Next →
        </button>
      </div>

      {/* Book Content */}
      <div
        ref={contentRef}
        className={`book-page circuit-hover ${isFlipping ? 'page-flipping' : ''}`}
        style={{
          minHeight: '400px',
          padding: '2rem',
          background: 'rgba(10, 10, 10, 0.7)',
          border: '1px solid rgba(0, 255, 255, 0.2)',
          borderRadius: '8px',
          position: 'relative',
          transition: 'all 0.3s ease'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Buttons */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        right: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        zIndex: 100
      }}>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsBookOpen(!isBookOpen)}
          className="search-trigger-btn"
          style={{ width: '40px', height: '40px', padding: '0' }}
        >
          📚
        </motion.button>
      </div>

      {/* Highlight Menu */}
      <AnimatePresence>
        {showHighlightMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-highlighter-pill"
            style={{
              position: 'fixed',
              left: menuPosition.x,
              top: menuPosition.y,
              zIndex: 10000,
              display: 'flex',
              gap: '4px'
            }}
          >
            <button
              onClick={() => addHighlight('yellow')}
              className="highlight-button"
              style={{ background: 'rgba(255, 215, 0, 0.3)', border: '1px solid rgba(255, 215, 0, 0.6)', color: 'white', width: '30px', height: '30px' }}
            >
              Y
            </button>
            <button
              onClick={() => addHighlight('blue')}
              className="highlight-button"
              style={{ background: 'rgba(0, 191, 255, 0.3)', border: '1px solid rgba(0, 191, 255, 0.6)', color: 'white', width: '30px', height: '30px' }}
            >
              B
            </button>
            <button
              onClick={() => addHighlight('green')}
              className="highlight-button"
              style={{ background: 'rgba(50, 205, 50, 0.3)', border: '1px solid rgba(50, 205, 50, 0.6)', color: 'white', width: '30px', height: '30px' }}
            >
              G
            </button>
            <button
              onClick={() => addHighlight('pink')}
              className="highlight-button"
              style={{ background: 'rgba(255, 105, 180, 0.3)', border: '1px solid rgba(255, 105, 180, 0.6)', color: 'white', width: '30px', height: '30px' }}
            >
              P
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Navigation Panel */}
      <AnimatePresence>
        {isBookOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="glass-container"
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              height: '100vh',
              width: '300px',
              zIndex: 9999,
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <h3 style={{ color: '#00ffff', fontFamily: 'Orbitron, sans-serif', marginBottom: '1rem' }}>Book Navigation</h3>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <h4 style={{ color: '#e0e0e0', marginBottom: '0.5rem' }}>Quick Jump</h4>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => {
                    onPageChange(i + 1);
                    setIsBookOpen(false);
                  }}
                  className={`search-filter-btn ${currentPage === i + 1 ? 'search-filter-btn--active' : ''}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginBottom: '0.25rem',
                    textAlign: 'left'
                  }}
                >
                  Page {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsBookOpen(false)}
              className="search-trigger-btn"
              style={{ width: '100%' }}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookReader;