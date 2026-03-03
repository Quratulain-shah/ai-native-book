import React, { useState } from 'react';
import { authClient, getSessionToken } from '../../lib/auth-client';

interface TranslateButtonProps {
  bookId: number;
  onTranslate: (translatedContent: string) => void;
}

const TranslateButton: React.FC<TranslateButtonProps> = ({ bookId, onTranslate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTranslated, setIsTranslated] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the session token (cookie or localStorage fallback)
      const token = await getSessionToken();

      if (!token) {
          throw new Error("Please sign in to translate.");
      }

      // Direct call to backend, matching ViewBook.tsx pattern
      const response = await fetch(`https://annashah-physical-ai-backend.hf.space/books/${bookId}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Translation failed.');
      }

      const translatedBook = await response.json();
      onTranslate(translatedBook.content); 
      setIsTranslated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button
        onClick={handleTranslate}
        disabled={loading || isTranslated}
        style={{
          padding: '12px 30px',
          background: isTranslated ? '#10B981' : '#FF9E68', // Success Green or Brand Orange
          color: isTranslated ? '#fff' : '#000',
          border: 'none',
          borderRadius: '50px',
          fontSize: '16px',
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
          cursor: isTranslated ? 'default' : 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          boxShadow: '0 8px 20px rgba(255, 158, 104, 0.3)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          opacity: loading ? 0.7 : 1
        }}
        onMouseOver={(e) => {
            if (!isTranslated && !loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(255, 158, 104, 0.4)';
            }
        }}
        onMouseOut={(e) => {
             if (!isTranslated && !loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 158, 104, 0.3)';
             }
        }}
      >
        {loading ? (
            <>
                <span className="loader"></span> Translating...
            </>
        ) : isTranslated ? (
            <>
                <span>✓</span> Translated to Urdu
            </>
        ) : (
            <>
                <span>🌐</span> Translate to Urdu
            </>
        )}
      </button>
      {error && (
        <p style={{ 
            color: '#ef4444', 
            marginTop: '15px', 
            fontFamily: "'Inter', sans-serif", 
            background: '#fef2f2', 
            padding: '10px', 
            borderRadius: '8px', 
            fontSize: '14px' 
        }}>
            ⚠️ Error: {error}
        </p>
      )}
    </div>
  );
};

export default TranslateButton;