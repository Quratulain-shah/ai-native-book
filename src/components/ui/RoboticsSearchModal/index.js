import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const RoboticsSearchModal = ({ isOpen, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const modalRef = useRef(null);

  // Handle Cmd+K shortcut - but let the plugin handle the search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Cmd+K or Ctrl+K - let the plugin handle this
      // We just focus on the floating button functionality
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close modal when location changes
  useEffect(() => {
    setShowModal(false);
  }, [location]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  return (
    <>
      {/* Search trigger button - visible on all pages except search page */}
      <motion.button
        onClick={() => {
          // Focus the search input when the button is clicked
          const searchInput = document.querySelector('input[placeholder="Search"]') ||
                             document.querySelector('.DocSearch-Button');
          if (searchInput) {
            searchInput.focus();
            // If it's the button, click it to open the search modal
            if (searchInput.classList.contains('DocSearch-Button') ||
                searchInput.classList.contains('navbar__search')) {
              searchInput.click();
            }
          } else {
            // Fallback: trigger the keyboard shortcut
            const event = new KeyboardEvent('keydown', {
              key: 'k',
              ctrlKey: true,
              bubbles: true
            });
            document.dispatchEvent(event);
          }
        }}
        className={clsx(
          'robotics-search-trigger',
          'fixed bottom-6 right-6 z-50',
          'w-12 h-12 rounded-full',
          'bg-gradient-to-br from-cyan-500 to-blue-600',
          'shadow-lg shadow-cyan-500/30',
          'flex items-center justify-center',
          'text-white hover:shadow-xl hover:shadow-cyan-500/50',
          'transition-all duration-300',
          'border border-cyan-400/30'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open search (Cmd+K)"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </motion.button>

      {/* We don't need our own modal since the plugin provides one */}
      {/* The floating button just triggers the existing search modal */}
    </>
  );
};

export default RoboticsSearchModal;