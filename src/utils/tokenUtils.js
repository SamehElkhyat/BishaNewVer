/**
 * JWT Token Utilities
 * Functions for decoding and validating JWT tokens
 */

/**
 * Decode JWT token payload
 * @param {string} token - JWT token string
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeJWTToken = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      console.warn('Invalid token provided to decodeJWTToken');
      return null;
    }

    // Split the token into parts
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.warn('Invalid JWT token format');
      return null;
    }

    // Get the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);

    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload);

    localStorage.setItem('DecodedToken', JSON.stringify(parsedPayload));
    
    return parsedPayload;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token string
 * @returns {boolean} - True if expired, false if valid
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeJWTToken(token);
    
    if (!decoded || !decoded.exp) {
      return true; // Consider invalid tokens as expired
    }
    
    // JWT exp is in seconds, Date.now() is in milliseconds
    const currentTime = Math.floor(Date.now() / 1000);
    
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Consider error as expired
  }
};

/**
 * Get user info from JWT token
 * @param {string} token - JWT token string
 * @returns {object|null} - User info or null if invalid
 */
export const getUserFromToken = (token) => {
  try {
    const decoded = decodeJWTToken(token);
    
    if (!decoded) {
      return null;
    }
    
    // Extract common JWT claims and custom user data
    return {
      id: decoded.sub || decoded.userId || decoded.id,
      email: decoded.email,
      name: decoded.name || decoded.username,
      role: decoded.role || decoded.Role,
      exp: decoded.exp,
      iat: decoded.iat,
      // Include any other custom claims
      ...decoded
    };
  } catch (error) {
    console.error('Error extracting user from token:', error);
    return null;
  }
};

/**
 * Get token from localStorage and decode it
 * @returns {object|null} - Decoded token data or null
 */
export const getDecodedTokenFromStorage = () => {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return null;
    }
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      console.warn('Token in localStorage is expired');
      // Optionally remove expired token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return null;
    }
    
    return getUserFromToken(token);
  } catch (error) {
    console.error('Error getting decoded token from storage:', error);
    return null;
  }
};

/**
 * Validate and refresh user data from token
 * @returns {object|null} - Valid user data or null
 */
export const validateAndRefreshUserFromToken = () => {
  try {
    const tokenData = getDecodedTokenFromStorage();
    if (!tokenData) {
      return null;
    }
    
    // Create user object with validated data
    const userData = {
      id: tokenData.id,
      email: tokenData.email,
      name: tokenData.name || tokenData.email,
      role: tokenData.role || 'user',
      tokenExp: tokenData.exp,
      tokenIat: tokenData.iat
    };
    
    return userData;
  } catch (error) {
    console.error('Error validating user from token:', error);
    return null;
  }
};
