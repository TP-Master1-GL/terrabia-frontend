// src/api/index.js - CORRIGÉ AVEC PASSWORD_CONFIRM
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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

// 🔐 API d'authentification - CORRIGÉE AVEC PASSWORD_CONFIRM
export const authAPI = {
  // Authentification JWT - Format Django
  login: (credentials) => {
    return api.post('/token/', {
      username: credentials.email,
      password: credentials.password
    })
  },
  
  refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
  
  // Inscription - AVEC PASSWORD_CONFIRM AJOUTÉ
  register: (userData) => {
    const djangoUserData = {
      // Champs obligatoires d'AbstractUser
      username: userData.email,
      email: userData.email,
      password: userData.password,
      password_confirm: userData.password, // ← CHAMP AJOUTÉ ICI
      first_name: userData.first_name,
      last_name: userData.last_name,
      
      // Champs personnalisés de votre modèle User
      user_type: userData.user_type,
      phone_number: userData.phone,
      address: userData.address,
      
      // Champs de profil selon le type d'utilisateur
      farm_name: userData.farm_name || '',
      company_name: userData.company_name || ''
    }
    
    console.log('Données envoyées à Django:', djangoUserData) // Pour debug
    
    return api.post('/auth/register/', djangoUserData)
  },
  
  // Vérification du token et récupération de l'utilisateur
  verifyToken: () => api.get('/auth/verify/'),
  getCurrentUser: () => api.get('/auth/users/me/'),
  
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

// Les autres APIs restent inchangées...
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

export const cartAPI = {
  getCart: () => api.get('/orders/cart/'),
  addToCart: (productData) => api.post('/orders/cart/add/', productData),
  updateCartItem: (itemId, quantity) => api.put(`/orders/cart/items/${itemId}/`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/orders/cart/items/${itemId}/remove/`),
}

export const ordersAPI = {
  getAll: (params) => api.get('/orders/orders/', { params }),
  getById: (id) => api.get(`/orders/orders/${id}/`),
  create: (orderData) => api.post('/orders/orders/', orderData),
  update: (id, orderData) => api.put(`/orders/orders/${id}/`, orderData),
  getMyOrders: () => api.get('/orders/orders/history/'),
}

export const chatAPI = {
  getConversations: () => api.get('/chat/conversations/'),
  getConversation: (conversationId) => api.get(`/chat/conversations/${conversationId}/`),
  createConversation: (participantData) => api.post('/chat/conversations/', participantData),
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}/messages/`),
  sendMessage: (conversationId, message) => api.post(`/chat/conversations/${conversationId}/messages/`, { 
    content: message 
  }),
}

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
    localStorage.removeItem('terrabia_user')
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