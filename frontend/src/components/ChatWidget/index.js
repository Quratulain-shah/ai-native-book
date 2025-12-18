import React, { useState } from 'react';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import styles from './styles.module.css';

const ChatWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsVisible(!isVisible);
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Add user message to chat
    const userMsg = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    addMessage(userMsg);

    setIsLoading(true);

    try {
      // Call backend API
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: 'default_conversation', // In a real app, you'd manage conversation IDs
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response to chat
      const aiMsg = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'ai',
        timestamp: new Date()
      };
      addMessage(aiMsg);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'system',
        timestamp: new Date()
      };
      addMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatWidget}>
      <ChatButton isVisible={isVisible} onClick={toggleChat} />
      {isVisible && (
        <ChatWindow
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          onClose={toggleChat}
        />
      )}
    </div>
  );
};

export default ChatWidget;