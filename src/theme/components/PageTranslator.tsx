import React, { useState, useEffect } from 'react';
import { authClient } from '../../lib/auth-client';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function PageTranslator() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const { data: session } = authClient.useSession();
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();

  const handleTranslatePage = async () => {
    // Auth Check
    if (!session) {
        alert("Please login or sign up to translate this page in Urdu.");
        history.push(`${siteConfig.baseUrl}login`);
        return;
    }

    if (isTranslated) {
      // Disconnect the mutation observer if it exists
      if ((window as any).translationObserver) {
        (window as any).translationObserver.disconnect();
        delete (window as any).translationObserver;
      }

      // Revert to original
      document.body.innerHTML = originalContent;

      // Remove Urdu styling
      document.body.classList.remove('urdu-mode');
      document.documentElement.dir = 'ltr';

      setIsTranslated(false);
      return;
    }

    setIsTranslating(true);
    
    // Save original content
    setOriginalContent(document.body.innerHTML);

    try {
        // Get text nodes
        // This is a naive approach. For production, use a library like 'i18next' or proper DOM traversal.
        // Here we will just translate the main readable content to avoid breaking scripts/styles.

        const contentNodes = [];
        const initialWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null
        );

        let initialNode;
        while (initialNode = initialWalker.nextNode()) {
            if (initialNode.nodeValue.trim() && initialNode.parentElement.tagName !== 'SCRIPT' && initialNode.parentElement.tagName !== 'STYLE') {
                contentNodes.push(initialNode);
            }
        }
        
        // For demo purposes, we'll translate distinct chunks to avoid huge payloads
        // In a real app, you'd batch these or just translate the main container.
        // Let's try to translate the 'main' tag content if it exists, otherwise body.
        const mainElement = document.querySelector('main') || document.body;
        const textToTranslate = mainElement.innerText; 

        // Handle large content by chunking it
        if (textToTranslate.length > 5000) {
            await translateLargeContent(mainElement, textToTranslate);
            setIsTranslated(true);
            setIsTranslating(false);
            return;
        }

        // Use local backend and include credentials for Auth check
        const response = await fetch('https://annashah-physical-ai-backend.hf.space/translate-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textToTranslate, language: 'ur' }),
            credentials: 'include' // Important: Send cookies for auth check
        });

        if (response.status === 401) {
             alert("Session expired. Please login again.");
             history.push(`${siteConfig.baseUrl}login`);
             return;
        }

        if (!response.ok) throw new Error('Translation service failed');
        
        const data = await response.json();
        
        // Apply Urdu Styling and Direction first to preserve structure
        document.body.classList.add('urdu-mode');
        // document.documentElement.dir = 'rtl'; // This flips everything including navbar, might be too much
        mainElement.setAttribute('dir', 'rtl');
        mainElement.classList.add('urdu-mode');

        // Translate the content while preserving HTML structure
        // Find all text nodes in the main content area and translate them individually
        const contentWalker = document.createTreeWalker(
            mainElement,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Only translate text nodes that are not inside script or style tags
                    if (node.parentElement?.tagName !== 'SCRIPT' && node.parentElement?.tagName !== 'STYLE') {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = contentWalker.nextNode()) {
            if (node.nodeValue?.trim()) {
                textNodes.push(node);
            }
        }

        // Translate each text node individually to preserve structure
        for (const textNode of textNodes) {
            const originalText = textNode.nodeValue || '';
            if (originalText.trim()) {
                try {
                    const response = await fetch('https://annashah-physical-ai-backend.hf.space/translate-text', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: originalText, language: 'ur' }),
                        credentials: 'include' // Important: Send cookies for auth check
                    });

                    if (response.ok) {
                        const data = await response.json();
                        textNode.nodeValue = data.translated_text;
                    }
                } catch (error) {
                    console.error('Error translating text node:', error);
                    // Keep original text if translation fails
                }
            }
        }

        // Translate UI elements after content translation
        setTimeout(() => {
          translateUIElements();

          // Set up a mutation observer to catch any dynamically added elements
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as Element;
                    // Check if this is a sidebar or navigation element
                    if (element.matches && (
                      element.matches('.sidebar *, .menu *, .navigation *, .nav *, [class*="sidebar"], [class*="menu"], [class*="nav"]') ||
                      element.querySelector('.sidebar, .menu, .navigation, .nav')
                    )) {
                      // Re-translate UI elements to catch new additions
                      setTimeout(() => translateUIElements(), 100);
                    }
                  }
                });
              }
            });
          });

          // Start observing for changes in the entire body
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });

          // Store the observer to potentially disconnect later
          (window as any).translationObserver = observer;
        }, 100);

        setIsTranslated(true);

    } catch (error) {
        console.error("Translation failed:", error);
        alert("Failed to translate page. Please try again later");
    } finally {
        setIsTranslating(false);
    }
  };

  const translateLargeContent = async (mainElement: Element, contentText: string) => {
    try {
      // Apply Urdu Styling and Direction first to preserve structure
      document.body.classList.add('urdu-mode');
      mainElement.setAttribute('dir', 'rtl');
      mainElement.classList.add('urdu-mode');

      // Split content into smaller chunks to avoid the 5000 character limit
      const chunkSize = 4000; // Keep it well under the limit with buffer
      const chunks = [];

      for (let i = 0; i < contentText.length; i += chunkSize) {
        chunks.push(contentText.substring(i, i + chunkSize));
      }

      // Process each chunk with translation
      const translatedChunks = [];
      for (const chunk of chunks) {
        const response = await fetch('https://annashah-physical-ai-backend.hf.space/translate-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: chunk, language: 'ur' }),
          credentials: 'include' // Important: Send cookies for auth check
        });

        if (response.status === 401) {
          alert("Session expired. Please login again.");
          history.push(`${siteConfig.baseUrl}login`);
          return;
        }

        if (!response.ok) {
          throw new Error('Translation service failed for a chunk');
        }

        const data = await response.json();
        translatedChunks.push(data.translated_text);
      }

      // Combine translated chunks and update the main element
      const fullTranslatedContent = translatedChunks.join('');

      // Apply the translated content while preserving HTML structure
      // Instead of using innerHTML which can break React components,
      // we'll temporarily store the HTML, translate text nodes, then restore
      mainElement.innerHTML = `<div class="urdu-content">${fullTranslatedContent}</div>`;

      // Find all text nodes in the main content area and apply styling
      const largeContentWalker = document.createTreeWalker(
          mainElement,
          NodeFilter.SHOW_TEXT,
          {
              acceptNode: function(largeNode) {
                  // Only process text nodes that are not inside script or style tags
                  if (largeNode.parentElement?.tagName !== 'SCRIPT' && largeNode.parentElement?.tagName !== 'STYLE') {
                      return NodeFilter.FILTER_ACCEPT;
                  }
                  return NodeFilter.FILTER_REJECT;
              }
          }
      );

      const textNodes = [];
      let largeNode;
      while (largeNode = largeContentWalker.nextNode()) {
          if (largeNode.nodeValue?.trim()) {
              textNodes.push(largeNode);
          }
      }

      // Apply styling to all text nodes to ensure proper Urdu display
      textNodes.forEach(textNode => {
          if (textNode.parentElement) {
              textNode.parentElement.style.fontFamily = "'Jameel Noori Nastaleeq', 'Urdu Typesetting', 'Arial Unicode MS', sans-serif";
              textNode.parentElement.dir = 'rtl';
              textNode.parentElement.style.textAlign = 'right';
          }
      });

      // Translate UI elements after content translation
      setTimeout(() => {
        translateUIElements();

        // Set up a mutation observer to catch any dynamically added elements
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  // Check if this is a sidebar or navigation element
                  if (element.matches && (
                    element.matches('.sidebar *, .menu *, .navigation *, .nav *, [class*="sidebar"], [class*="menu"], [class*="nav"]') ||
                    element.querySelector('.sidebar, .menu, .navigation, .nav')
                  )) {
                    // Re-translate UI elements to catch new additions
                    setTimeout(() => translateUIElements(), 100);
                  }
                }
              });
            }
          });
        });

        // Start observing for changes in the entire body
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        // Store the observer to potentially disconnect later
        (window as any).translationObserver = observer;
      }, 100);
    } catch (error) {
      console.error("Translation of large content failed:", error);
      alert("Failed to translate large page content. Please try again later");
    }
  };

  const translateUIElements = () => {
    // Define common English to Urdu translations for UI elements
    const translations: Record<string, string> = {
      'Course Content': 'کورس کا مواد',
      'About': 'کے بارے میں',
      'GitHub': 'گیتھب',
      'Login': 'لاگ ان',
      'Register': 'رجسٹر',
      'Profile': 'پروفائل',
      'Logout': 'لاگ آوٹ',
      'Home': 'ہوم',
      'Documentation': 'دستاویزات',
      'Community': 'کمیونٹی',
      'More': 'مزید',
      'Course': 'کورس',
      'Overview': 'جائزہ',
      'Hardware Requirements': 'ہارڈ ویئر کی ضروریات',
      'GitHub Issues': 'گیتھب مسائل',
      'Discussions': 'بحث مباحثے',
      'About Me': 'میرے بارے میں',
      'GitHub Repo': 'گیتھب ریپو',
      'Physical AI & Humanoid Robotics': 'فزیکل ای آئی اور ہیومنوائڈ روبوٹکس',
      'Bridging the gap between the digital brain and the physical body.': 'ڈیجیٹل دماغ اور جسم کے درمیان فاصلہ پر قابو پانے کے لئے۔',
      'Search': 'تلاش کریں',
      'Menu': 'مینو',
      'Module 1': 'میڈیول 1',
      'Module 2': 'میڈیول 2',
      'Module 3': 'میڈیول 3',
      'Module 4': 'میڈیول 4',
      'The Robotic Nervous System': 'روبوٹک نروس سسٹم',
      'The Digital Twin': 'ڈیجیٹل ٹوئن',
      'Simulation and Physics': 'سمولیشن اور فزکس',
      'Vision, Language & Action': 'وژن، زبان اور ایکشن',
      'ROS 2 Fundamentals': 'ROS 2 فنڈامینٹلز',
      'Nodes, Topics & Services': 'نوڈس، ٹوپکس اور سروسز',
      'URDF Modeling': 'URDF ماڈلنگ',
      'RCLPY Python': 'RCLPY پائی تھون',
      'Digital Twin Simulation': 'ڈیجیٹل ٹوئن سمولیشن',
      'Physical Deployment': 'فزیکل ڈیپلائمنٹ',
      'LIDAR & Depth Cameras': 'لیڈر اور ڈیپتھ کیمراس',
      'Sensor Integration': 'سینسر انٹیگریشن',
      'Sim-to-Real Transfer': 'سم ٹو ریل ٹرانسفر',
      'Unity Rendering': 'یونٹی رینڈرنگ',
      'Digital Twin Exercises': 'ڈیجیٹل ٹوئن ایکسرسائزس',
      'NVIDIA Isaac': 'اینویڈیا ایسیک',
      'Cognitive Planning': 'کاگنیٹو پلیننگ',
      'Whisper Audio Processing': 'وِسپر آڈیو پروسیسنگ',
      'Vision Language Action': 'وژن لینگویج ایکشن',
      'Simulated Capstone Project': 'سمولیٹڈ کیپسٹون پروجیکٹ',
      'Autonomous Humanoid Capstone': 'آٹونومس ہیومنوائڈ کیپسٹون',
      'Module Overview': 'میڈیول جائزہ',
      'Hardware Requirements': 'ہارڈ ویئر کی ضروریات',
      'Syllabus': 'سیلیبس',
      'Pedagogical Approach': 'پیڈاگوجیکل ایپروچ',
      'Safety Guidelines': 'سیفٹی گائیڈ لائنز',
      'Introduction': 'تعارف',
      'Getting Started': 'شروع کریں',
      'Exercises': 'ایکسرسائزس',
      'Assessment': 'ایسیسمنٹ',
      'Capstone Project': 'کیپسٹون پروجیکٹ',
      'Resources': 'ریسورسز',
      'References': 'حوالہ جات',
      'Next': 'اگلا',
      'Previous': 'پچھلا',
      'Table of Contents': 'فہرست',
      'Related Articles': 'متعلقہ مضامین'
    };

    // Translate navbar items
    const navbarLinks = document.querySelectorAll('.navbar__link, .navbar__item, .navbar__title');
    navbarLinks.forEach(element => {
      const originalText = element.textContent?.trim() || '';
      if (translations[originalText]) {
        element.textContent = translations[originalText];
      }
    });

    // Translate footer items
    const footerLinks = document.querySelectorAll('.footer__link-item, .footer__title, .footer__copyright');
    footerLinks.forEach(element => {
      const originalText = element.textContent?.trim() || '';
      if (translations[originalText]) {
        element.textContent = translations[originalText];
      } else {
        // Check for partial matches within the text
        let updatedText = originalText;
        Object.entries(translations).forEach(([english, urdu]) => {
          if (updatedText.includes(english)) {
            updatedText = updatedText.replace(new RegExp(english, 'g'), urdu);
          }
        });
        if (updatedText !== originalText) {
          element.textContent = updatedText;
        }
      }
    });

    // Translate sidebar items - comprehensive selector to catch all sidebar elements
    const sidebarItems = document.querySelectorAll(
      '.menu__list-item-collapsible .menu__link, ' +
      '.menu__list-item .menu__link, ' +
      '.menu__list-item span, ' +
      '.menu__list-item a, ' +
      '.sidebar__item, ' +
      '.sidebar__link, ' +
      '.theme-doc-sidebar-menu .menu__link, ' +
      '.menu__list-item-text, ' +
      '.theme-doc-sidebar-menu, ' +
      '.sidebar, ' +
      '.sidebar .menu, ' +
      '.sidebar .menu__list, ' +
      '.sidebar .menu__list-item, ' +
      '.sidebar .menu__link, ' +
      '.sidebar .menu__caret, ' +
      '.sidebar .menu__collapse, ' +
      '.theme-sidebar-menu, ' +
      '.sidebar-container, ' +
      '.doc-sidebar, ' +
      '.navigation-slider, ' +
      '.nav-sidebar, ' +
      '.sidebar-item, ' +
      '.sidebar-link, ' +
      '.sidebar-title, ' +
      '.sidebar-header, ' +
      '.menu__list-item-collapsible, ' +
      '.menu__caret'
    );
    sidebarItems.forEach(element => {
      const originalText = element.textContent?.trim() || '';
      if (originalText && originalText.length > 0) {
        if (translations[originalText]) {
          element.textContent = translations[originalText];
        } else {
          // Check for partial matches within the text
          let updatedText = originalText;
          Object.entries(translations).forEach(([english, urdu]) => {
            if (updatedText.includes(english)) {
              updatedText = updatedText.replace(new RegExp(english, 'g'), urdu);
            }
          });
          if (updatedText !== originalText) {
            element.textContent = updatedText;
          }
        }
      }
    });

    // Translate headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(element => {
      const originalText = element.textContent?.trim() || '';
      if (translations[originalText]) {
        element.textContent = translations[originalText];
      } else {
        // Check for partial matches within the text
        let updatedText = originalText;
        Object.entries(translations).forEach(([english, urdu]) => {
          if (updatedText.includes(english)) {
            updatedText = updatedText.replace(new RegExp(english, 'g'), urdu);
          }
        });
        if (updatedText !== originalText) {
          element.textContent = updatedText;
        }
      }
    });
  };

  return (
    <>
      <button
        onClick={handleTranslatePage}
        style={{
          position: 'fixed',
          bottom: '100px', // Above chatbot
          left: '30px',
          zIndex: 9998,
          padding: '12px',
          borderRadius: '50%',
          border: 'none',
          background: isTranslated ? '#10B981' : '#fff',
          color: isTranslated ? '#fff' : '#333',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50px',
          height: '50px',
          transition: 'all 0.3s ease'
        }}
        title={isTranslated ? "Revert to English" : "Translate Page to Urdu"}
      >
        {isTranslating ? (
          <span className="loader" style={{width: '20px', height: '20px', border: '2px solid #ccc', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></span>
        ) : (
          <span style={{fontSize: '20px'}}>🌐</span>
        )}
      </button>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .urdu-content {
          font-family: 'Jameel Noori Nastaleeq', 'Urdu Typesetting', 'Arial Unicode MS', sans-serif !important;
          direction: rtl;
          text-align: right;
          line-height: 1.8;
        }
        .urdu-mode {
          font-family: 'Jameel Noori Nastaleeq', 'Urdu Typesetting', 'Arial Unicode MS', sans-serif !important;
        }
        [dir="rtl"] {
          direction: rtl;
          text-align: right;
        }
      `}</style>
    </>
  );
}