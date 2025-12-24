import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  module: string;
  timestamp: Date;
}

interface BookmarksProps {
  initialBookmarks?: Bookmark[];
}

const Bookmarks: React.FC<BookmarksProps> = ({ initialBookmarks = [] }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : initialBookmarks;
  });

  const [showBookmarks, setShowBookmarks] = useState(false);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = () => {
    const currentUrl = window.location.pathname;
    const title = document.title || 'Untitled Page';
    const moduleMatch = currentUrl.match(/\/docs\/([^\/]+)/);
    const module = moduleMatch ? moduleMatch[1].replace(/-/g, ' ') : 'General';

    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      title: title.replace(' | Physical AI & Humanoid Robotics', ''),
      url: currentUrl,
      module: module.charAt(0).toUpperCase() + module.slice(1),
      timestamp: new Date(),
    };

    // Check if bookmark already exists
    const exists = bookmarks.some(b => b.url === currentUrl);
    if (!exists) {
      setBookmarks(prev => [newBookmark, ...prev]);
    }
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const toggleBookmarks = () => {
    setShowBookmarks(!showBookmarks);
  };

  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    if (!acc[bookmark.module]) {
      acc[bookmark.module] = [];
    }
    acc[bookmark.module].push(bookmark);
    return acc;
  }, {} as Record<string, Bookmark[]>);

  return (
    <div className={styles.bookmarksContainer}>
      <button
        className={styles.bookmarkToggle}
        onClick={toggleBookmarks}
        title={showBookmarks ? "Hide Bookmarks" : "Show Bookmarks"}
      >
        <span className={styles.bookmarkIcon}>🔖</span>
        <span className={styles.bookmarkText}>{showBookmarks ? "Hide" : "Show"} Bookmarks</span>
        {bookmarks.length > 0 && (
          <span className={styles.bookmarkCount}>{bookmarks.length}</span>
        )}
      </button>

      {showBookmarks && (
        <div className={styles.bookmarksPanel}>
          <div className={styles.bookmarksHeader}>
            <h3>Your Bookmarks</h3>
            <button
              className={styles.addCurrentBtn}
              onClick={addBookmark}
              disabled={bookmarks.some(b => b.url === window.location.pathname)}
            >
              {bookmarks.some(b => b.url === window.location.pathname)
                ? "Bookmarked"
                : "Bookmark Current Page"}
            </button>
          </div>

          {bookmarks.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📚</div>
              <p>No bookmarks yet. Bookmark important pages to access them quickly.</p>
            </div>
          ) : (
            <div className={styles.bookmarksList}>
              {Object.entries(groupedBookmarks).map(([module, moduleBookmarks]) => (
                <div key={module} className={styles.moduleGroup}>
                  <h4 className={styles.moduleTitle}>{module}</h4>
                  {moduleBookmarks.map((bookmark) => (
                    <div key={bookmark.id} className={styles.bookmarkItem}>
                      <a
                        href={bookmark.url}
                        className={styles.bookmarkLink}
                        onClick={(e) => {
                          if (!bookmark.url.startsWith('http')) {
                            e.preventDefault();
                            window.location.href = bookmark.url;
                          }
                        }}
                      >
                        <div className={styles.bookmarkContent}>
                          <div className={styles.bookmarkTitle}>{bookmark.title}</div>
                          <div className={styles.bookmarkUrl}>{bookmark.url}</div>
                          <div className={styles.bookmarkTime}>
                            {new Date(bookmark.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </a>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeBookmark(bookmark.id)}
                        title="Remove bookmark"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;