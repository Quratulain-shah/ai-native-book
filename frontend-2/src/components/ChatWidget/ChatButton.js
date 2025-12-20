import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const ChatButton = ({ isVisible, onClick, isOpen = false }) => {
  return (
    <button
      className={clsx(styles.chatButton, {
        [styles.hidden]: isVisible,
        [styles.hexagonButton]: true,
        [styles.isOpen]: isOpen
      })}
      onClick={onClick}
      aria-label={isVisible ? 'Close chat' : 'Open chat'}
    >
      <div className={styles.hexagon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.chatIcon}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
    </button>
  );
};

export default ChatButton;