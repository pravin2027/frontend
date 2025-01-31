import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://backend-e2vm.onrender.com/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for CORS
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // Increased timeout for deployed server
});

// Add better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Please check if the backend server is running');
    }
    const message = error.response?.data?.message || "An error occurred. Please try again.";
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Add request interceptor for authentication
api.interceptors.request.use(
  config => {
    console.log('Making request to:', config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Assignment API endpoints
export const assignmentService = {
  fetchAssignments: async () => {
    const response = await api.get('/assignments');
    return response.data;
  },

  addAssignment: async (assignmentData) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },

  updateAssignment: async (id, assignmentData) => {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  }
};

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  signup: async (userData) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const { token, user } = await authService.login({ email, password });
    localStorage.setItem('token', token);
    onLogin(user);
  } catch (error) {
    setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    console.error('Login error:', error);
  }
};

export default api;
