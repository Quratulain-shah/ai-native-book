import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useThemeConfig } from '@docusaurus/theme-common';
import styles from './styles.module.css';

// System Status Footer Component
const Footer = () => {
  const [latency, setLatency] = useState(42); // Initial simulated latency
  const [isOnline, setIsOnline] = useState(true);
  const [version] = useState('1.0.4');

  // Simulate live latency updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate latency fluctuating between 20-80ms
      const newLatency = Math.floor(Math.random() * 60) + 20;
      setLatency(newLatency);

      // Occasionally simulate connection status changes
      if (Math.random() > 0.95) { // 5% chance to toggle status
        setIsOnline(prev => !prev);
        setTimeout(() => setIsOnline(true), 2000); // Reset to online after 2 seconds
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const themeConfig = useThemeConfig();
  const { copyright } = themeConfig.footer || {};

  return (
    <footer className={clsx('docusaurus-mt-lg', styles.footer)}>
      <div className={styles.statusBar}>
        <div className={styles.statusContainer}>
          {/* Status Indicator */}
          <div className={styles.statusIndicator}>
            <div className={clsx(styles.led, isOnline ? styles.ledGreen : styles.ledRed)}></div>
            <span className={styles.statusText}>
              SYSTEM STATUS: <span className={isOnline ? styles.statusOnline : styles.statusOffline}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </span>
          </div>

          {/* Version Indicator */}
          <div className={styles.versionIndicator}>
            <span className={styles.versionText}>VERSION: {version}</span>
          </div>

          {/* Latency Indicator */}
          <div className={styles.latencyIndicator}>
            <span className={styles.latencyText}>LATENCY: {latency}ms</span>
          </div>

          {/* Copyright */}
          {copyright && (
            <div className={styles.copyright}>
              <span className={styles.copyrightText}>{copyright}</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;