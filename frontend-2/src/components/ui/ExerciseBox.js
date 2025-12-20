import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExerciseBox = ({
  title = 'Exercise',
  difficulty = 'medium',
  points = 10,
  children,
  solution = null,
  hints = []
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const difficultyColors = {
    easy: { bg: 'rgba(0, 255, 0, 0.1)', border: 'rgba(0, 255, 0, 0.3)', text: '#00ff00' },
    medium: { bg: 'rgba(255, 255, 0, 0.1)', border: 'rgba(255, 255, 0, 0.3)', text: '#ffff00' },
    hard: { bg: 'rgba(255, 0, 0, 0.1)', border: 'rgba(255, 0, 0, 0.3)', text: '#ff0000' }
  };

  const currentDifficulty = difficultyColors[difficulty] || difficultyColors.medium;

  const handleSubmit = () => {
    if (solution && userAnswer.trim().toLowerCase() === solution.trim().toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setSubmitted(true);
  };

  return (
    <div
      className="exercise-box circuit-hover"
      style={{
        border: `2px solid ${currentDifficulty.border}`,
        background: currentDifficulty.bg,
        position: 'relative'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '-0.8rem',
        left: '1rem',
        background: '#1a1a1a',
        padding: '0 0.5rem',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ color: currentDifficulty.text, fontWeight: 'bold' }}>
          {title}
        </span>
        <span style={{
          fontSize: '0.7rem',
          color: currentDifficulty.text,
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '0.1rem 0.3rem',
          borderRadius: '2px'
        }}>
          {difficulty.toUpperCase()}
        </span>
        <span style={{
          fontSize: '0.7rem',
          color: '#00ffff',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '0.1rem 0.3rem',
          borderRadius: '2px'
        }}>
          {points} pts
        </span>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {children}

        {hints.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h5 style={{ color: '#00ffff', fontFamily: 'Orbitron, sans-serif', marginBottom: '0.5rem' }}>
              Hints
            </h5>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {hints.map((hint, index) => (
                <button
                  key={index}
                  onClick={() => setShowHint(showHint === index ? null : index)}
                  className="search-filter-btn"
                  style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                >
                  Hint {index + 1}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {showHint !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 255, 255, 0.2)',
                    borderRadius: '4px'
                  }}
                >
                  <p style={{ margin: 0, color: '#c0c0c0' }}>
                    {hints[showHint]}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {solution && (
          <div style={{ marginTop: '1rem' }}>
            <h5 style={{ color: '#00ffff', fontFamily: 'Orbitron, sans-serif', marginBottom: '0.5rem' }}>
              Answer Submission
            </h5>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="search-input"
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.9rem'
                }}
              />
              <button
                onClick={handleSubmit}
                className="search-trigger-btn"
                style={{ fontSize: '0.9rem' }}
              >
                Submit
              </button>
            </div>

            {submitted && (
              <div style={{
                padding: '0.5rem',
                borderRadius: '4px',
                background: isCorrect ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                border: `1px solid ${isCorrect ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`,
                color: isCorrect ? '#00ff00' : '#ff0000'
              }}>
                {isCorrect ? '✓ Correct! Well done.' : '✗ Incorrect. Try again or review the material.'}
              </div>
            )}
          </div>
        )}

        {solution && (
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="search-filter-btn"
              style={{ fontSize: '0.9rem' }}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>

            <AnimatePresence>
              {showSolution && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: '0.5rem',
                    padding: '1rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 255, 255, 0.2)',
                    borderRadius: '4px'
                  }}
                >
                  <h6 style={{ color: '#00ffff', fontFamily: 'Orbitron, sans-serif', marginBottom: '0.5rem' }}>
                    Solution:
                  </h6>
                  <div style={{ color: '#c0c0c0', whiteSpace: 'pre-wrap' }}>
                    {solution}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseBox;