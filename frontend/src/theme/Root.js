import React from 'react';
import ChatWidget from '../components/ChatWidget';
import BackgroundEffects from '../components/ui/BackgroundEffects';
import { SearchProvider } from '../contexts/SearchContext';

// Root component that will be used to wrap the entire Docusaurus app
export default function Root({ children }) {
  return (
    <SearchProvider>
      <>
        <BackgroundEffects />
        {children}
        <ChatWidget />
      </>
    </SearchProvider>
  );
}