'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../styles/LoadingScreen.module.css';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContainer}>
        <div className={styles.logoContainer}>
          <Image
            src="/bisha-chamber-logo.png"
            alt="غرفة بيشة التجارية"
            width={200}
            height={200}
            className={styles.logo}
            loading="lazy"
          />
        </div>
        
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
        
        <div className={styles.loadingText}>
          <h2 className={styles.mainText}>غرفة بيشة التجارية</h2>
          <p className={styles.subText}>جاري التحميل...</p>
        </div>
        
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
