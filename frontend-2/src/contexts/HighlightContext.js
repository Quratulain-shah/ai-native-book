import React, { createContext, useContext, useReducer } from 'react';

const HighlightContext = createContext();

const highlightReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_HIGHLIGHT':
      return {
        ...state,
        highlights: {
          ...state.highlights,
          [action.pagePath]: [
            ...(state.highlights[action.pagePath] || []),
            action.highlight
          ]
        }
      };
    case 'REMOVE_HIGHLIGHT':
      return {
        ...state,
        highlights: {
          ...state.highlights,
          [action.pagePath]: state.highlights[action.pagePath]?.filter(h => h.id !== action.highlightId) || []
        }
      };
    case 'SET_HIGHLIGHTS':
      return {
        ...state,
        highlights: action.highlights
      };
    case 'CLEAR_PAGE_HIGHLIGHTS':
      const newHighlights = { ...state.highlights };
      delete newHighlights[action.pagePath];
      return {
        ...state,
        highlights: newHighlights
      };
    default:
      return state;
  }
};

export const HighlightProvider = ({ children }) => {
  const [state, dispatch] = useReducer(highlightReducer, {
    highlights: {},
    selectedText: null,
    selectionRange: null
  });

  return (
    <HighlightContext.Provider value={{ state, dispatch }}>
      {children}
    </HighlightContext.Provider>
  );
};

export const useHighlight = () => {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error('useHighlight must be used within a HighlightProvider');
  }
  return context;
};