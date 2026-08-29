'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Admin Route Protection Component
 * Only allows admin users to access wrapped content
 * Redirects non-admin users to home page
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If no user is logged in, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // If user is not admin, redirect to home
    if (!isAdmin()) {
      router.push('/');
      return;
    }
  }, [user, isAdmin, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>جاري التحقق من الصلاحيات...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Don't render anything if user is not admin (will redirect)
  if (!user || !isAdmin()) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        color: '#dc3545'
      }}>
        <h2>🚫 غير مصرح لك بالوصول</h2>
        <p>هذه الصفحة مخصصة للمديرين فقط</p>
        <p>جاري إعادة التوجيه...</p>
      </div>
    );
  }

  // Render admin content
  return <>{children}</>;
};

export default AdminRoute;
