// api.js - Version corrigée pour Django
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

// Test de connexion API
export const testConnection = async () => {
  try {
    const response = await api.get('/products/')
    return response.data
  } catch (error) {
    console.error('Backend connection failed:', error)
    throw error
  }
}

// 🔐 API d'authentification - CORRIGÉE POUR DJANGO
export const authAPI = {
  // Authentification JWT - Format Django standard
  login: (credentials) => {
    // Django JWT attend généralement 'username' au lieu de 'email'
    return api.post('/token/', {
      username: credentials.email, // ou credentials.email selon votre configuration
      password: credentials.password
    })
  },
  
  refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
  
  // Inscription - Format adapté pour Django
  register: (userData) => {
    // Format les données pour Django
    const djangoUserData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      password: userData.password,
      // Si votre API Django nécessite une confirmation de mot de passe
      password2: userData.password, 
      user_type: userData.user_type,
      phone: userData.phone,
      address: userData.address,
      farm_name: userData.farm_name || ''
    }
    
    return api.post('/auth/register/', djangoUserData)
  },
  
  // Authentification personnalisée (si vous l'utilisez)
  customLogin: (credentials) => api.post('/auth/login/', credentials),
  
  // Vérification du token (vous devrez créer cet endpoint dans Django)
  verifyToken: () => api.get('/auth/verify/'),
  
  // Gestion des tokens
  setTokens: (access, refresh) => {
    localStorage.setItem('token', access)
    localStorage.setItem('refresh_token', refresh)
  },
  clearTokens: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
  }
}

// 🛒 API Panier
export const cartAPI = {
  getCart: () => api.get('/orders/cart/'),
  addToCart: (productData) => api.post('/orders/cart/add/', productData),
  updateCartItem: (itemId, quantity) => api.put(`/orders/cart/items/${itemId}/`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/orders/cart/items/${itemId}/remove/`),
}

// 📦 API Commandes
export const ordersAPI = {
  getAll: (params) => api.get('/orders/orders/', { params }),
  getById: (id) => api.get(`/orders/orders/${id}/`),
  create: (orderData) => api.post('/orders/orders/', orderData),
  update: (id, orderData) => api.put(`/orders/orders/${id}/`, orderData),
  getMyOrders: () => api.get('/orders/orders/history/'),
}

// ⭐ API Avis
export const reviewsAPI = {
  create: (reviewData) => api.post('/orders/reviews/', reviewData),
  getMyReviews: () => api.get('/orders/reviews/my/'),
}

// 🛍️ API Produits
export const productsAPI = {
  getAll: (params) => api.get('/products/products/', { params }),
  getById: (id) => api.get(`/products/products/${id}/`),
  create: (productData) => api.post('/products/products/', productData),
  update: (id, productData) => api.put(`/products/products/${id}/`, productData),
  delete: (id) => api.delete(`/products/products/${id}/`),
  getCategories: () => api.get('/products/categories/'),
  search: (query, params = {}) => api.get('/products/products/', { 
    params: { search: query, ...params } 
  }),
}

// 💬 API Chat
export const chatAPI = {
  getConversations: () => api.get('/chat/conversations/'),
  getConversation: (conversationId) => api.get(`/chat/conversations/${conversationId}/`),
  createConversation: (participantData) => api.post('/chat/conversations/', participantData),
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}/messages/`),
  sendMessage: (conversationId, message) => api.post(`/chat/conversations/${conversationId}/messages/`, { 
    content: message 
  }),
}

// 👤 API Utilisateurs
export const usersAPI = {
  getUsers: (params) => api.get('/auth/users/', { params }),
  getUser: (userId) => api.get(`/auth/users/${userId}/`),
  getCurrentUser: () => api.get('/auth/users/me/'),
  updateUser: (userData) => api.put('/auth/users/me/', userData),
}

// Utility functions
export const apiUtils = {
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
  
  getToken: () => {
    return localStorage.getItem('token')
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/login'
  },
  
  handleError: (error) => {
    if (error.response) {
      return error.response.data
    } else if (error.request) {
      return { message: 'No response from server' }
    } else {
      return { message: error.message }
    }
  }
}

export default api