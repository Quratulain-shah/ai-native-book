import React from 'react';
import clsx from 'clsx';
import OriginalCodeBlock from '@theme-original/CodeBlock';
import styles from './styles.module.css';

const CodeBlock = (props) => {
  return (
    <div className={styles.terminalContainer}>
      {/* Terminal window title bar with traffic lights */}
      <div className={styles.terminalTitleBar}>
        <div className={styles.trafficLights}>
          <div className={styles.light} style={{ backgroundColor: '#ff5f57' }}></div>
          <div className={styles.light} style={{ backgroundColor: '#ffbd2e' }}></div>
          <div className={styles.light} style={{ backgroundColor: '#28c940' }}></div>
        </div>
        <div className={styles.terminalTitle}>TERMINAL</div>
        <div className={styles.terminalControls}>
          <div className={styles.controlButton}>_</div>
          <div className={styles.controlButton}>□</div>
          <div className={styles.controlButton}>×</div>
        </div>
      </div>

      {/* Terminal content area */}
      <div className={styles.terminalContent}>
        <div className={styles.terminalPrompt}>
          <span className={styles.promptSymbol}>$</span>
          <span className={styles.filePath}>~/project</span>
        </div>

        {/* Original code block */}
        <div className={styles.codeWrapper}>
          <OriginalCodeBlock {...props} />
        </div>
      </div>

      {/* Terminal status bar */}
      <div className={styles.terminalStatusBar}>
        <div className={styles.statusInfo}>
          <span className={styles.statusItem}>BASH</span>
          <span className={styles.statusItem}>UTF-8</span>
          <span className={styles.statusItem}>LF</span>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;