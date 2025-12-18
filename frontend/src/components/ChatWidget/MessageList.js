import React from 'react';
import styles from './styles.module.css';

const MessageList = ({ messages, isLoading }) => {
  return (
    <div className={styles.messageList}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${
            message.sender === 'user' ? styles.userMessage :
            message.sender === 'ai' ? styles.aiMessage :
            styles.systemMessage
          }`}
        >
          <div className={styles.messageContent}>{message.text}</div>
          <div className={styles.messageTimestamp}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className={`${styles.message} ${styles.aiMessage}`}>
          <div className={styles.messageContent}>
            <span className={styles.typingIndicator}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;