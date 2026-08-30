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
    <div className={styles.loadingOverlay} role="status" aria-live="polite">
      <div className={styles.loadingContainer}>
        <Image
          src="/bisha-chamber-logo.png"
          alt="غرفة بيشة التجارية"
          width={120}
          height={120}
          className={styles.logo}
          priority
        />

        <span className={styles.spinner} aria-hidden="true" />

        <p className={styles.subText}>جاري التحميل</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
