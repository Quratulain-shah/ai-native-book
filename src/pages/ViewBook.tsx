import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useParams } from 'react-router-dom';
import TranslateButton from '../components/Book/TranslateButton';
import Quiz from '../components/Book/Quiz';
import Multimedia from '../components/Book/Multimedia';
import styles from '../components/Book/BookStyles.module.css';
import clsx from 'clsx';

interface ViewBookParams {
  book_id: string;
}

const ViewBookPage: React.FC = () => {
  const { book_id } = useParams<ViewBookParams>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reading State
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      setIsAuthenticated(true);
    } else {
      alert("Please enter both email and password.");
    }
  };

  const fetchBookContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://annashah-physical-ai-backend.hf.space/books/${book_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch book content.');
      }
      const bookData = await response.json();
      setTitle(bookData.title);
      setContent(bookData.content);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && book_id) {
      fetchBookContent();
    }
  }, [book_id, isAuthenticated]);

  // Scroll Progress Listener
  useEffect(() => {
      const handleScroll = () => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (window.scrollY / totalHeight) * 100;
          setScrollProgress(progress);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTranslatedContent = (translatedContent: string) => {
    setContent(translatedContent); 
  };

  if (!isAuthenticated) {
    return (
      <Layout title="Login to Read">
        <div className={styles.container}>
          <div className={styles.authContainer}>
            <form className={styles.authBox} onSubmit={handleLogin}>
              <h2 className={styles.authTitle}>Reader Access</h2>
              <p className={styles.authText}>This premium content requires authentication. Please verify your identity.</p>
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
              <input 
                type="password" 
                placeholder="Access Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
              <button type="submit" className={styles.button}>Unlock Content →</button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={title ? `Reading: ${title}` : 'View Book'}>
      {/* Progress Bar */}
      <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />

      {/* Reading Mode Toggle */}
      <button 
        className={styles.toggleButton} 
        onClick={() => setIsReadingMode(!isReadingMode)}
        title={isReadingMode ? "Exit Focus Mode" : "Enter Focus Mode"}
      >
        {isReadingMode ? '✕' : '👁'}
      </button>

      <div className={clsx(styles.container, isReadingMode && styles.readingMode)}>
        {loading && (
            <div style={{ 
                textAlign: 'center', 
                marginTop: '150px', 
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.5rem',
                color: 'var(--ifm-color-emphasis-600)'
            }}>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span> Loading your book...
            </div>
        )}
        
        {error && (
            <div style={{ 
                textAlign: 'center', 
                marginTop: '50px', 
                color: '#ef4444', 
                padding: '2rem', 
                background: 'var(--ifm-background-color)',
                borderRadius: '12px',
                maxWidth: '600px',
                margin: '50px auto',
                border: '1px solid #ef4444'
            }}>
                <strong>Unable to load content:</strong> {error}
            </div>
        )}
        
        {!loading && !error && (
          <div className={clsx(styles.contentContainer, isReadingMode && styles.readingContentContainer)}>
            <div className={styles.metadata}>
                <span>Physical AI Series</span>
                <span>{isReadingMode ? 'Focus Mode Active' : 'Standard View'}</span>
            </div>

            <h1 className={styles.header}>{title}</h1>
            
            {/* Main Content */}
            <div 
                className={clsx(styles.content, isReadingMode && styles.readingContent)}
                dangerouslySetInnerHTML={{ __html: content }} 
            />
            
            <hr style={{ margin: '5rem 0', border: 'none', borderTop: '1px solid var(--ifm-color-emphasis-200)' }} />

            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
               <TranslateButton bookId={Number(book_id)} onTranslate={handleTranslatedContent} />
            </div>

            {/* New Interactive Components */}
            <Multimedia />
            <Quiz />

          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewBookPage;