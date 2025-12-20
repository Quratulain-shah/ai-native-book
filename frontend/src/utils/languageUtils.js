/**
 * Language utilities for Urdu multilingual support
 */

// Get the current language from URL, localStorage, or default
export const getCurrentLanguage = () => {
  // Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const langFromUrl = urlParams.get('lang');
  if (langFromUrl && ['en', 'ur'].includes(langFromUrl)) {
    return langFromUrl;
  }

  // Check localStorage
  const langFromStorage = localStorage.getItem('preferred-language');
  if (langFromStorage && ['en', 'ur'].includes(langFromStorage)) {
    return langFromStorage;
  }

  // Default to English if no preference found
  return 'en';
};

// Set the preferred language in localStorage
export const setPreferredLanguage = (language) => {
  if (['en', 'ur'].includes(language)) {
    localStorage.setItem('preferred-language', language);
  }
};

// Get direction based on language (for RTL support)
export const getLanguageDirection = (language) => {
  return language === 'ur' ? 'rtl' : 'ltr';
};

// Apply language direction to document
export const applyLanguageDirection = (language) => {
  const direction = getLanguageDirection(language);
  document.documentElement.setAttribute('dir', direction);

  // Update document attributes for accessibility
  document.documentElement.setAttribute('lang', language);
};

// Initialize language settings
export const initializeLanguage = () => {
  const currentLang = getCurrentLanguage();
  applyLanguageDirection(currentLang);
  return currentLang;
};

// Switch language and update UI
export const switchLanguage = (newLanguage) => {
  if (!['en', 'ur'].includes(newLanguage)) {
    console.warn(`Unsupported language: ${newLanguage}`);
    return;
  }

  // Set the preferred language
  setPreferredLanguage(newLanguage);

  // Apply direction
  applyLanguageDirection(newLanguage);

  // For Docusaurus, we need to navigate to the correct locale URL
  // Get the current path without the locale prefix
  const currentPath = window.location.pathname;
  let newPath = currentPath;

  // Remove existing locale prefix if present
  if (currentPath.startsWith('/en/') || currentPath.startsWith('/ur/')) {
    const pathParts = currentPath.split('/');
    pathParts.shift(); // Remove empty first element
    const locale = pathParts.shift(); // Get the locale
    if (['en', 'ur'].includes(locale)) {
      newPath = '/' + pathParts.join('/');
    }
  }

  // Add the new locale prefix
  const finalPath = `/${newLanguage}${newPath}`;

  // Navigate to the new locale URL
  window.location.href = finalPath;
};