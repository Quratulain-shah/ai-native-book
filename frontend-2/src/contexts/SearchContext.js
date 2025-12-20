import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import RoboticsSearchModal from '../components/ui/RoboticsSearchModal';

const SearchContext = createContext();

const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        query: action.query,
        results: action.results || state.results
      };
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        results: action.results
      };
    case 'SET_IS_SEARCHING':
      return {
        ...state,
        isSearching: action.isSearching
      };
    case 'CLEAR_SEARCH':
      return {
        ...state,
        query: '',
        results: [],
        isSearching: false
      };
    case 'SET_SEARCH_MODAL_OPEN':
      return {
        ...state,
        isSearchModalOpen: action.isOpen
      };
    default:
      return state;
  }
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, {
    query: '',
    results: [],
    isSearching: false,
    searchHistory: [],
    isSearchModalOpen: false
  });

  // Handle Cmd+K / Ctrl+K globally
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Cmd+K (Mac) or Ctrl+K (Windows/Linux) is pressed
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: 'SET_SEARCH_MODAL_OPEN', isOpen: true });
      }
    };

    // Add event listener to the document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openSearchModal = () => dispatch({ type: 'SET_SEARCH_MODAL_OPEN', isOpen: true });
  const closeSearchModal = () => dispatch({ type: 'SET_SEARCH_MODAL_OPEN', isOpen: false });

  const value = {
    state,
    dispatch,
    openSearchModal,
    closeSearchModal,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};