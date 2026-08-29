// API service for connecting to Bisha Chamber backend
import axios from "axios";

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ---------------------------------------------------------------------------
// Cookie-based auth: every request to the backend must carry the session
// cookie. Force credentials on the shared axios instance (covers every page
// that imports `axios` directly) and clean up any stale `Bearer null` header.
// ---------------------------------------------------------------------------
axios.defaults.withCredentials = true;

if (!axios.__bishaCredentialsInterceptor) {
  axios.interceptors.request.use((config) => {
    config.withCredentials = true;

    // Drop a stale "Bearer null" / "Bearer undefined" header so the session
    // cookie is used cleanly. A real bearer token is left untouched.
    const h = config.headers;
    if (h) {
      const value =
        typeof h.get === "function"
          ? h.get("Authorization")
          : h.Authorization ?? h.authorization;
      if (
        typeof value === "string" &&
        /^Bearer\s*(null|undefined)?\s*$/i.test(value)
      ) {
        if (typeof h.delete === "function") {
          h.delete("Authorization");
        } else {
          delete h.Authorization;
          delete h.authorization;
        }
      }
    }
    return config;
  });
  axios.__bishaCredentialsInterceptor = true;
}

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Optional bearer fallback — only when a real token is cached locally.
  // The session normally travels in an HttpOnly cookie (see credentials below).
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    // Send / receive the auth cookie on every cross-origin backend call
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);

    // Check if the response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    // Check if response has content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Authentication APIs
export const authAPI = {
  login: async (credentials) => {
    return fetchAPI("/Login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return fetchAPI("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Request a password-reset link by email
  forgotPassword: async (email) => {
    return fetchAPI("/Register/Forgot-Password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Set a new password using the token from the emailed link
  resetPassword: async ({ email, token, newPassword, confirmPassword }) => {
    return fetchAPI("/Register/Reset-Password", {
      method: "POST",
      body: JSON.stringify({ email, token, newPassword, confirmPassword }),
    });
  },
};

// Verification (2FA) APIs
export const verifyAPI = {
  verifyCode: async (code, typeOfGenerate = "VerifyLogin") => {
    return fetchAPI("/Verify/VerifyCode", {
      method: "POST",
      body: JSON.stringify({ code, typeOfGenerate }),
    });
  },

  resendCode: async (typeOfGenerate = "VerifyLogin") => {
    return fetchAPI(
      `/Verify/Resend-Code?typeOfGenerate=${encodeURIComponent(typeOfGenerate)}`,
      {
        method: "POST",
      }
    );
  },
};

// News APIs
export const newsAPI = {
  getAll: async (pageNumber = 1) => {
    return fetchAPI(`/NewsPaper/Get-All/${pageNumber}`);
  },

  getById: async (id) => {
    return fetchAPI(`/NewsPaper/Get-All-Circulars-ByID/${id}`);
  },

  getAllCirculars: async (pageNumber = 1) => {
    return fetchAPI(`/NewsPaper/Get-All-Circulars/${pageNumber}`);
  },

  getCircularById: async (id) => {
    return fetchAPI(`/NewsPaper/Get-All-Circulars-ByID/${id}`);
  },

  create: async (newsData) => {
    return fetchAPI("/NewsPaper/Add", {
      method: "POST",
      body: JSON.stringify(newsData),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/NewsPaper/Delete/${id}`, {
      method: "DELETE",
    });
  },
};

// Chamber activities / events APIs
export const activityAPI = {
  getAll: async (pageNumber = 1) => {
    return fetchAPI(`/Activity/Get-All/${pageNumber}`);
  },

  getById: async (id) => {
    return fetchAPI(`/Activity/Get-By-Id/${id}`);
  },
};

// Circulars (التعاميم) APIs
export const circularAPI = {
  getAll: async (pageNumber = 1) => {
    return fetchAPI(`/Circular/Get-All/${pageNumber}`);
  },

  getById: async (id) => {
    return fetchAPI(`/Activity/Get-By-Id/${id}`);
  },
};

// Clients APIs
export const clientsAPI = {
  getAll: async () => {
    return fetchAPI("/Clients");
  },

  getById: async (id) => {
    return fetchAPI(`/Clients/${id}`);
  },

  create: async (clientData) => {
    return fetchAPI("/Clients", {
      method: "POST",
      body: JSON.stringify(clientData),
    });
  },

  update: async (id, clientData) => {
    return fetchAPI(`/Clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(clientData),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/Clients/${id}`, {
      method: "DELETE",
    });
  },
};

// File upload API
export const fileAPI = {
  upload: async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetchAPI(`/Files/upload?type=${type}`, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },
};

// Users APIs
export const usersAPI = {
  getAll: async () => {
    return fetchAPI("/Users");
  },

  getById: async (id) => {
    return fetchAPI(`/Users/${id}`);
  },

  create: async (userData) => {
    return fetchAPI("/Users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  update: async (id, userData) => {
    return fetchAPI(`/Users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/Register/Delete/${id}`, {
      method: "DELETE",
    });
  },
};

// Survey APIs
export const surveyAPI = {
  // Submit Sectoral Committees survey
  submitSectoralCommittees: async (surveyData) => {
    return fetchAPI("/Sectoral-committees", {
      method: "POST",
      body: JSON.stringify(surveyData),
    });
  },

  // Submit Subscribers to Services survey
  submitSubscribersToServices: async (surveyData) => {
    return fetchAPI("/Subscribers-to-services", {
      method: "POST",
      body: JSON.stringify(surveyData),
    });
  },
};

const api = {
  auth: authAPI,
  news: newsAPI,
  clients: clientsAPI,
  file: fileAPI,
  users: usersAPI,
  survey: surveyAPI,
};

export default api;
