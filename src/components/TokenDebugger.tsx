'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Token Debugger Component
 * Shows decoded token information for debugging purposes
 * Remove this component in production
 */
const TokenDebugger: React.FC = () => {
  const { user, getDecodedToken, isTokenValid } = useAuth();

  const decodedToken = getDecodedToken();
  const tokenValid = isTokenValid();

  if (!user) {
    return (
      <div style={{ 
        padding: '1rem', 
        margin: '1rem', 
        border: '1px solid #ccc', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>🔐 Token Debug Info</h3>
        <p><strong>Status:</strong> No user logged in</p>
        <p><strong>Token Valid:</strong> {tokenValid ? '✅ Yes' : '❌ No'}</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '1rem', 
      margin: '1rem', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      fontFamily: 'monospace',
      fontSize: '14px'
    }}>
      <h3>🔐 Token Debug Info</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <h4>Current User (from Context):</h4>
        <pre style={{ backgroundColor: '#fff', padding: '0.5rem', borderRadius: '4px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h4>Decoded Token Data:</h4>
        {decodedToken ? (
          <pre style={{ backgroundColor: '#fff', padding: '0.5rem', borderRadius: '4px' }}>
            {JSON.stringify(decodedToken, null, 2)}
          </pre>
        ) : (
          <p style={{ color: 'red' }}>❌ No valid token found</p>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h4>Token Status:</h4>
        <p><strong>Valid:</strong> {tokenValid ? '✅ Yes' : '❌ No'}</p>
        {decodedToken && (
          <>
            <p><strong>Expires:</strong> {new Date(decodedToken.exp * 1000).toLocaleString()}</p>
            <p><strong>Issued:</strong> {new Date(decodedToken.iat * 1000).toLocaleString()}</p>
            <p><strong>User ID:</strong> {decodedToken.id}</p>
            <p><strong>Email:</strong> {decodedToken.email}</p>
            <p><strong>Role:</strong> {decodedToken.role}</p>
          </>
        )}
      </div>

      <div style={{ 
        padding: '0.5rem', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>⚠️ Debug Component:</strong> Remove this component in production!
      </div>
    </div>
  );
};

export default TokenDebugger;
