import React, { useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import styles from './styles.module.css';

const ChatWindow = ({ messages, onSendMessage, isLoading, onClose }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <h3>AI Assistant</h3>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close chat">
          ×
        </button>
      </div>
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;