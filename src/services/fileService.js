// File upload service for handling image uploads
import { fileAPI } from './api';

// Supported file types
export const FILE_TYPES = {
  NEWS_IMAGE: 'news',
  PROFILE_IMAGE: 'profile',
  DOCUMENT: 'document',
  GENERAL: 'general'
};

// Maximum file size in bytes (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Allowed document types
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

/**
 * Validates file size and type
 * @param {File} file - The file to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {Object} - Validation result with isValid and error properties
 */
export const validateFile = (file, allowedTypes = ALLOWED_IMAGE_TYPES, maxSize = MAX_FILE_SIZE) => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File size exceeds the maximum limit of ${Math.round(maxSize / (1024 * 1024))}MB` 
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `File type not supported. Allowed types: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}` 
    };
  }

  return { isValid: true, error: null };
};

/**
 * Uploads a file to the server
 * @param {File} file - The file to upload
 * @param {string} type - The type of file (from FILE_TYPES)
 * @returns {Promise<Object>} - The server response with file URL
 */
export const uploadFile = async (file, type = FILE_TYPES.GENERAL) => {
  // Validate the file before uploading
  const validation = validateFile(
    file, 
    type === FILE_TYPES.DOCUMENT ? ALLOWED_DOCUMENT_TYPES : ALLOWED_IMAGE_TYPES
  );
  
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  
  try {
    const response = await fileAPI.upload(file, type);
    return response;
  } catch (error) {
    console.error('File upload failed:', error);
    throw new Error(error.message || 'File upload failed');
  }
};

export default {
  uploadFile,
  validateFile,
  FILE_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  MAX_FILE_SIZE
};
