import React, { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot';
import PageTranslator from './components/PageTranslator';

// Wrapper to ensure these components are available on every page
export default function Root({children}) {
  // State to hold selected text for the chatbot context
  const [selectedText, setSelectedText] = useState('');

  // Global text selection handler
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        setSelectedText(selection.toString());
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, []);

  return (
    <>
      {children}
      
      {/* Global Components */}
      <div style={{ position: 'relative', zIndex: 9999 }}>
         <Chatbot selectedText={selectedText} />
         {/* We place the translator on the left to balance the UI */}
         <PageTranslator />
      </div>
    </>
  );
}