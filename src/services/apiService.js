// src/services/apiService.js
import { 
  authAPI, 
  productsAPI, 
  cartAPI, 
  ordersAPI, 
  usersAPI,
  apiUtils
} from './api'

import api from './api'

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token')
    this.user = JSON.parse(localStorage.getItem('user') || 'null')
  }

  // 🔐 Authentification
  async login(credentials) {
    try {
      console.log('🔐 Tentative de connexion avec:', credentials.email)
      
      const response = await authAPI.login(credentials)
      const { access, refresh, user } = response.data
      
      if (!access) {
        throw new Error('Token d\'accès non reçu')
      }
      
      // Sauvegarder les tokens
      authAPI.setTokens(access, refresh)
      
      // Si l'utilisateur est dans la réponse, le sauvegarder
      if (user) {
        this.user = user
        localStorage.setItem('user', JSON.stringify(user))
        return { user, token: access }
      }
      
      // Sinon, récupérer l'utilisateur
      const userResponse = await this.getCurrentUser()
      this.user = userResponse
      localStorage.setItem('user', JSON.stringify(userResponse))
      
      return { user: userResponse, token: access }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error)
      throw this.handleError(error)
    }
  }

  async register(userData) {
    try {
      console.log('📝 Inscription de l\'utilisateur:', userData.email)
      
      const response = await authAPI.register(userData)
      console.log('✅ Réponse d\'inscription:', response.data)
      
      const { access, refresh, user } = response.data
      
      if (access && refresh) {
        authAPI.setTokens(access, refresh)
        
        if (user) {
          this.user = user
          localStorage.setItem('user', JSON.stringify(user))
          return { user, token: access }
        }
        
        const userResponse = await this.getCurrentUser()
        this.user = userResponse
        localStorage.setItem('user', JSON.stringify(userResponse))
        return { user: userResponse, token: access }
      } else {
        console.log('⚠️ Aucun token reçu, tentative de connexion...')
        const loginResult = await this.login({
          email: userData.email,
          password: userData.password
        })
        return loginResult
      }
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', error)
      throw this.handleError(error)
    }
  }

  async getCurrentUser() {
    try {
      const response = await authAPI.getCurrentUser()
      return response.data
    } catch (error) {
      console.error('❌ Erreur récupération utilisateur:', error)
      
      try {
        const endpoints = [
          '/auth/me/',
          '/users/me/',
          '/auth/user/',
          '/profile/'
        ]
        
        for (const endpoint of endpoints) {
          try {
            const response = await api.get(endpoint)
            return response.data
          } catch (e) {
            continue
          }
        }
        
        throw new Error('Impossible de récupérer les informations utilisateur')
      } catch (finalError) {
        throw this.handleError(finalError)
      }
    }
  }

  // 💬 CHAT - NOUVELLES FONCTIONS AJOUTÉES
  async getConversations() {
    try {
      const response = await api.get('/chat/conversations/')
      return response.data
    } catch (error) {
      console.error('❌ Erreur récupération conversations:', error)
      throw this.handleError(error)
    }
  }

  async getMessages(conversationId) {
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages/`)
      return response.data
    } catch (error) {
      console.error('❌ Erreur récupération messages:', error)
      throw this.handleError(error)
    }
  }

  async sendMessage(conversationId, content) {
    try {
      const response = await api.post(`/chat/conversations/${conversationId}/messages/`, {
        content
      })
      return response.data
    } catch (error) {
      console.error('❌ Erreur envoi message:', error)
      throw this.handleError(error)
    }
  }

  async markAsRead(conversationId) {
    try {
      const response = await api.post(`/chat/conversations/${conversationId}/mark_read/`)
      return response.data
    } catch (error) {
      console.error('❌ Erreur marquage comme lu:', error)
      throw this.handleError(error)
    }
  }

  async createConversation(participantId) {
    try {
      const response = await api.post('/chat/conversations/', {
        participant_id: participantId
      })
      return response.data
    } catch (error) {
      console.error('❌ Erreur création conversation:', error)
      throw this.handleError(error)
    }
  }

  async updateProfile(userData) {
    try {
      const response = await usersAPI.updateUser(userData)
      
      this.user = { ...this.user, ...response.data }
      localStorage.setItem('user', JSON.stringify(this.user))
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  logout() {
    authAPI.clearTokens()
    this.user = null
    this.token = null
    apiUtils.logout()
  }

  // 🛍️ Produits
  async getProducts(params = {}) {
    try {
      const response = await productsAPI.getAll(params)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getProduct(id) {
    try {
      const response = await productsAPI.getById(id)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createProduct(productData) {
    try {
      const response = await productsAPI.create(productData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateProduct(id, productData) {
    try {
      const response = await productsAPI.update(id, productData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteProduct(id) {
    try {
      const response = await productsAPI.delete(id)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getMyProducts() {
    try {
      const response = await productsAPI.getMyProducts()
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async toggleFavorite(productId) {
    try {
      try {
        const response = await api.post(`/products/${productId}/favorite/`)
        return response.data
      } catch (error) {
        const response = await api.post('/favorites/', { product_id: productId })
        return response.data
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getFavorites() {
    try {
      const response = await api.get('/favorites/')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 🛒 Panier
  async getCart() {
    try {
      const response = await cartAPI.getCart()
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async addToCart(productId, quantity = 1) {
    try {
      const response = await cartAPI.addToCart({ 
        product: productId, 
        quantity 
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateCartItem(itemId, quantity) {
    try {
      const response = await cartAPI.updateCartItem(itemId, quantity)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async removeFromCart(itemId) {
    try {
      const response = await cartAPI.removeFromCart(itemId)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async clearCart() {
    try {
      const response = await cartAPI.clearCart()
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 📦 Commandes
  async getOrders() {
    try {
      const response = await ordersAPI.getMyOrders()
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getFarmerOrders() {
    try {
      const response = await ordersAPI.getFarmerOrders()
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createOrder(orderData) {
    try {
      const response = await ordersAPI.create(orderData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await ordersAPI.updateStatus(orderId, status)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 👥 Utilisateurs
  async getUsers(params = {}) {
    try {
      const response = await usersAPI.getUsers(params)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getUser(userId) {
    try {
      const response = await usersAPI.getUser(userId)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 🔧 Utilitaires
  handleError(error) {
    console.error('API Service Error:', error)
    
    if (error.response) {
      const { data, status } = error.response
      
      let message = 'Erreur serveur'
      
      if (typeof data === 'string') {
        message = data
      } else if (data.detail) {
        message = data.detail
      } else if (data.message) {
        message = data.message
      } else if (data.error) {
        message = data.error
      } else if (data.non_field_errors) {
        message = data.non_field_errors.join(', ')
      } else if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0]
        if (Array.isArray(data[firstKey])) {
          message = `${firstKey}: ${data[firstKey].join(', ')}`
        } else if (typeof data[firstKey] === 'string') {
          message = `${firstKey}: ${data[firstKey]}`
        }
      }
      
      const apiError = new Error(message)
      apiError.status = status
      apiError.data = data
      throw apiError
    } else if (error.request) {
      throw new Error('Pas de réponse du serveur. Vérifiez votre connexion.')
    } else {
      throw new Error(`Erreur de configuration: ${error.message}`)
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('token')
    return !!token && token !== 'null' && token !== 'undefined'
  }

  getCurrentUserData() {
    return this.user
  }

  setUser(user) {
    this.user = user
    localStorage.setItem('user', JSON.stringify(user))
  }

  // Rafraîchir le token
  async refreshAuthToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }
      
      const response = await authAPI.refreshToken(refreshToken)
      const { access, refresh } = response.data
      
      authAPI.setTokens(access, refresh)
      return access
    } catch (error) {
      this.logout()
      throw error
    }
  }
}

// Créer une instance unique
const apiServiceInstance = new ApiService()

// Ajouter l'intercepteur pour rafraîchir le token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const newToken = await apiServiceInstance.refreshAuthToken()
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        apiServiceInstance.logout()
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiServiceInstance