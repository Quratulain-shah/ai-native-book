import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TableOfContents = ({ chapters, currentChapter, onChapterSelect }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (chapterIndex) => {
    setExpandedSections(prev => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex]
    }));
  };

  return (
    <div className="glass-container" style={{
      padding: '1.5rem',
      margin: '1rem 0',
      minHeight: '400px'
    }}>
      <h2 className="glitch" style={{ color: '#00ffff', fontFamily: 'Orbitron, sans-serif', marginBottom: '1.5rem' }}>
        Table of Contents
      </h2>

      <div className="circuit-hover" style={{
        border: '1px solid rgba(0, 255, 255, 0.2)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        {chapters.map((chapter, index) => (
          <div key={index} className="circuit-hover" style={{ borderBottom: index < chapters.length - 1 ? '1px solid rgba(0, 255, 255, 0.1)' : 'none' }}>
            <div
              onClick={() => toggleSection(index)}
              className="search-filter-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                cursor: 'pointer',
                background: currentChapter === index ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                color: currentChapter === index ? '#00ffff' : '#e0e0e0'
              }}
            >
              <span>
                <strong>Chapter {index + 1}:</strong> {chapter.title}
              </span>
              <span>{expandedSections[index] ? '▼' : '▶'}</span>
            </div>

            <AnimatePresence>
              {expandedSections[index] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '1rem 1rem 1rem 2rem' }}>
                    {chapter.sections.map((section, sectionIndex) => (
                      <div
                        key={sectionIndex}
                        onClick={() => onChapterSelect(index, sectionIndex)}
                        className="search-filter-btn"
                        style={{
                          padding: '0.5rem',
                          margin: '0.25rem 0',
                          cursor: 'pointer',
                          background: 'rgba(0, 255, 255, 0.05)',
                          borderLeft: '2px solid rgba(0, 255, 255, 0.3)'
                        }}
                      >
                        {sectionIndex + 1}. {section.title}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOfContents;