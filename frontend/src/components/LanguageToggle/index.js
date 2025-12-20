import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';
import { useDocsPreferredVersion } from '@docusaurus/plugin-content-docs/client';
import { getCurrentLanguage, setPreferredLanguage, getLanguageDirection, applyLanguageDirection, switchLanguage } from '../../../utils/languageUtils';

const LanguageToggle = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const location = useLocation();

  // Initialize language on component mount
  useEffect(() => {
    const lang = getCurrentLanguage();
    setCurrentLanguage(lang);
    applyLanguageDirection(lang);
  }, []);

  // Update language when location changes
  useEffect(() => {
    const lang = getCurrentLanguage();
    setCurrentLanguage(lang);
    applyLanguageDirection(lang);
  }, [location]);

  const handleLanguageChange = (newLanguage) => {
    switchLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  // Get the current docs preferred version for proper URL handling
  const { preferredVersion } = useDocsPreferredVersion('default');

  return (
    <div className="navbar__item dropdown dropdown--nocaret">
      <button
        className="navbar__link dropdown__trigger"
        aria-label={translate({
          id: 'theme.navbar.langSwitchButton',
          message: 'Language switch',
        })}
        aria-haspopup="true"
      >
        {currentLanguage === 'ur' ? 'اردو' : 'English'}
      </button>
      <ul className="dropdown__menu">
        <li>
          <button
            className={`dropdown__link ${currentLanguage === 'en' ? 'dropdown__link--active' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </button>
        </li>
        <li>
          <button
            className={`dropdown__link ${currentLanguage === 'ur' ? 'dropdown__link--active' : ''}`}
            onClick={() => handleLanguageChange('ur')}
          >
            اردو
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageToggle;