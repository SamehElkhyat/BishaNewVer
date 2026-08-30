'use client';

import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

interface AppWrapperProps {
  children: React.ReactNode;
}
const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsLoading(false);
      return;
    }

    const handleLoad = () => setIsLoading(false);
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}>
        {children}
      </div>
    </>
  );
};

export default AppWrapper;
