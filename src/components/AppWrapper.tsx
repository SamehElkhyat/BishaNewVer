'use client';

import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

interface AppWrapperProps {
  children: React.ReactNode;
}
const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and ensure all resources are loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading time

    // Also check if document is ready
    const checkReady = () => {
      if (document.readyState === 'complete') {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500); // Minimum 1.5 seconds to show the beautiful loading screen
      }
    };

    if (document.readyState === 'complete') {
      checkReady();
    } else {
      document.addEventListener('readystatechange', checkReady);
    }

    return () => {
      clearTimeout(timer);
      document.removeEventListener('readystatechange', checkReady);
    };
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}>
        {children}
      </div>
    </>
  );
};

export default AppWrapper;
