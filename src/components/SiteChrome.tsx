'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

// Dashboard-style routes render their own full-screen chrome and shouldn't
// get the public site's Header/Footer/background.
export const HIDDEN_PREFIXES = ['/admin', '/voting-dashboard'];

interface SiteChromeProps {
  children: React.ReactNode;
}

const SiteChrome: React.FC<SiteChromeProps> = ({ children }) => {
  const pathname = usePathname() || '';
  const hideChrome = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default SiteChrome;
