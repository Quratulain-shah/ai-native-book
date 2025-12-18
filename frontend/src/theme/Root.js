import React from 'react';
import ChatWidget from '../components/ChatWidget';

// Root component that will be used to wrap the entire Docusaurus app
export default function Root({ children }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}