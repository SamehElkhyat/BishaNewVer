'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * User Status Component
 * Shows current user authentication status and role
 * Useful for debugging and user feedback
 */
const UserStatus: React.FC = () => {
  const { user, isAdmin, loading, getDecodedToken, isTokenValid } = useAuth();

  if (loading) {
    return (
      <div style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        fontSize: '0.875rem',
        color: '#6c757d'
      }}>
        جاري التحقق من المستخدم...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        fontSize: '0.875rem',
        color: '#856404'
      }}>
        👤 غير مسجل الدخول
      </div>
    );
  }

  const tokenValid = isTokenValid();
  const decodedToken = getDecodedToken();

  return (
    <div style={{
      padding: '0.5rem 1rem',
      backgroundColor: isAdmin() ? '#d1ecf1' : '#d4edda',
      border: `1px solid ${isAdmin() ? '#bee5eb' : '#c3e6cb'}`,
      borderRadius: '4px',
      fontSize: '0.875rem',
      color: isAdmin() ? '#0c5460' : '#155724'
    }}>
      <div style={{ fontWeight: 'bold' }}>
        {isAdmin() ? '🔧 مدير النظام' : '👤 مستخدم عادي'}: {user.name || user.email}
      </div>
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
        الدور: {user.role} | Token: {tokenValid ? '✅ صالح' : '❌ منتهي الصلاحية'}
        {decodedToken && (
          <span> | ينتهي: {new Date(decodedToken.exp * 1000).toLocaleDateString('ar-SA')}</span>
        )}
      </div>
    </div>
  );
};

export default UserStatus;
