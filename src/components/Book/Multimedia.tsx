import React from 'react';
import styles from './BookStyles.module.css';

const Multimedia = () => {
  return (
    <div className={styles.mediaContainer}>
      <h3 className={styles.mediaTitle}>🎥 Deep Dive: Boston Dynamics Atlas</h3>
      <div className={styles.mediaVideoWrapper}>
        <iframe 
            className={styles.mediaIframe}
            src="https://www.youtube.com/embed/tF4DML7FIWk" 
            title="Boston Dynamics Atlas" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
        ></iframe>
      </div>
      <p className={styles.mediaCaption}>Watch how modern control theory applies to humanoid locomotion.</p>
    </div>
  );
};

export default Multimedia;