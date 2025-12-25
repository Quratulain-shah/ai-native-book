import React, { useState } from 'react';
import styles from './BookStyles.module.css';
import clsx from 'clsx';

const Quiz = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const correctAnswer = 'B';

  const handleCheck = () => {
    setShowResult(true);
  };

  const options = [
    { id: 'A', text: 'Keyboard & Mouse' },
    { id: 'B', text: 'Camera, Lidar & IMU' },
    { id: 'C', text: 'Touchscreen Display' },
    { id: 'D', text: 'Microphone only' },
  ];

  return (
    <div className={styles.quizContainer}>
      <h3 className={styles.quizTitle}>🧠 Knowledge Check</h3>
      <p className={styles.quizQuestion}>What are the primary sensors used in Physical AI for perception?</p>
      
      <ul className={styles.quizOptionsList}>
        {options.map((opt) => (
          <li 
            key={opt.id}
            onClick={() => !showResult && setSelectedAnswer(opt.id)}
            className={clsx(
                styles.quizOptionItem,
                selectedAnswer === opt.id && styles.quizOptionSelected,
                showResult && opt.id === correctAnswer && styles.quizOptionCorrect,
                showResult && selectedAnswer === opt.id && selectedAnswer !== correctAnswer && styles.quizOptionIncorrect
            )}
          >
            <div style={{
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                border: '2px solid var(--ifm-color-emphasis-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: selectedAnswer === opt.id ? (showResult ? (opt.id === correctAnswer ? '#10b981' : '#ef4444') : '#FF9E68') : 'var(--ifm-color-emphasis-400)'
            }}>
                {selectedAnswer === opt.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: showResult ? (opt.id === correctAnswer ? '#10b981' : '#ef4444') : '#FF9E68' }} />}
            </div>
            {opt.text}
          </li>
        ))}
      </ul>

      {!showResult ? (
        <button 
            className={styles.quizButton}
            onClick={handleCheck}
            disabled={!selectedAnswer}
            style={{ opacity: selectedAnswer ? 1 : 0.5, cursor: selectedAnswer ? 'pointer' : 'not-allowed' }}
        >
          Check Answer
        </button>
      ) : (
          <div className={styles.quizFeedback} style={{ color: selectedAnswer === correctAnswer ? '#10b981' : '#ef4444' }}>
              {selectedAnswer === correctAnswer ? "✅ Correct! Cameras and Lidars provide visual and spatial data." : "❌ Incorrect. Physical AI relies on sensors like cameras and lidar."}
          </div>
      )}
    </div>
  );
};

export default Quiz;