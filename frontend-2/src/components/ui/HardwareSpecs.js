import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HardwareSpecs = ({ title = 'Hardware Specifications', specs = [], comparisonData = null }) => {
  const [expandedSpecs, setExpandedSpecs] = useState({});

  const toggleSpec = (index) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="hardware-specs circuit-hover" style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '-0.8rem',
        left: '1rem',
        background: '#1a1a1a',
        padding: '0 0.5rem',
        fontSize: '0.9rem',
        color: '#00ffff',
        textTransform: 'uppercase',
        fontWeight: 'bold'
      }}>
        {title}
      </div>

      <div style={{ marginTop: '1rem' }}>
        {specs.map((spec, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div
              onClick={() => toggleSpec(index)}
              className="search-filter-btn"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                cursor: 'pointer',
                background: 'rgba(0, 255, 255, 0.05)',
                borderLeft: '2px solid rgba(0, 255, 255, 0.3)'
              }}
            >
              <span style={{ fontWeight: 'bold', color: '#e0e0e0' }}>
                {spec.name}
              </span>
              <span style={{ color: '#00ffff' }}>
                {expandedSpecs[index] ? '▼' : '▶'}
              </span>
            </div>

            <AnimatePresence>
              {expandedSpecs[index] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    overflow: 'hidden',
                    padding: '1rem',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(0, 255, 255, 0.1)',
                    borderRadius: '0 0 4px 4px',
                    marginTop: '0.25rem'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <h6 style={{ color: '#00ffff', marginBottom: '0.5rem' }}>Value</h6>
                      <p style={{ color: '#e0e0e0', margin: 0 }}>{spec.value}</p>
                    </div>
                    {spec.unit && (
                      <div>
                        <h6 style={{ color: '#00ffff', marginBottom: '0.5rem' }}>Unit</h6>
                        <p style={{ color: '#e0e0e0', margin: 0 }}>{spec.unit}</p>
                      </div>
                    )}
                    {spec.description && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <h6 style={{ color: '#00ffff', marginBottom: '0.5rem' }}>Description</h6>
                        <p style={{ color: '#a0a0a0', margin: 0, fontSize: '0.9rem' }}>{spec.description}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {comparisonData && (
        <div style={{ marginTop: '1rem' }}>
          <h5 style={{ color: '#00ffff', fontFamily: 'Orbitron, sans-serif', marginBottom: '0.5rem' }}>
            Comparison
          </h5>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(0, 255, 255, 0.1)'
            }}>
              <thead>
                <tr style={{ background: 'rgba(0, 255, 255, 0.1)' }}>
                  <th style={{ padding: '0.5rem', border: '1px solid rgba(0, 255, 255, 0.1)', color: '#00ffff' }}>Specification</th>
                  {comparisonData.models.map((model, index) => (
                    <th key={index} style={{ padding: '0.5rem', border: '1px solid rgba(0, 255, 255, 0.1)', color: '#e0e0e0' }}>
                      {model.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonData.specs.map((spec, index) => (
                  <tr key={index}>
                    <td style={{ padding: '0.5rem', border: '1px solid rgba(0, 255, 255, 0.1)', color: '#e0e0e0' }}>
                      {spec.name}
                    </td>
                    {comparisonData.models.map((model, modelIndex) => (
                      <td key={modelIndex} style={{ padding: '0.5rem', border: '1px solid rgba(0, 255, 255, 0.1)', color: '#e0e0e0' }}>
                        {model.values[spec.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HardwareSpecs;