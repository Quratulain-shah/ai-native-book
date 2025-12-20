import { useEffect } from 'react';

const useCmdKListener = (onOpen) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Cmd+K (Mac) or Ctrl+K (Windows/Linux) is pressed
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };

    // Add event listener to the document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpen]);
};

export default useCmdKListener;