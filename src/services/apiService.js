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

  // 🌿 CATÉGORIES
  async getCategories() {
    try {
      // Essayer plusieurs endpoints possibles
      const endpoints = [
        '/products/categories/',
        '/categories/',
        '/api/products/categories/'
      ]
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint)
          console.log('✅ Catégories récupérées depuis:', endpoint)
          return response.data
        } catch (e) {
          console.log(`❌ Échec pour ${endpoint}:`, e.message)
          continue
        }
      }
      
      // Si aucun endpoint ne fonctionne, retourner des catégories par défaut
      console.warn('⚠️ Aucun endpoint de catégories trouvé, retour des catégories par défaut')
      return [
        { id: 1, name: 'Fruits', slug: 'fruits' },
        { id: 2, name: 'Légumes', slug: 'legumes' },
        { id: 3, name: 'Céréales', slug: 'cereales' },
        { id: 4, name: 'Viandes', slug: 'viandes' },
        { id: 5, name: 'Produits Laitiers', slug: 'produits-laitiers' },
        { id: 6, name: 'Épicerie', slug: 'epicerie' }
      ]
    } catch (error) {
      console.error('❌ Erreur récupération catégories:', error)
      throw this.handleError(error)
    }
  }

  async getCategory(id) {
    try {
      const response = await api.get(`/products/categories/${id}/`)
      return response.data
    } catch (error) {
      console.error('❌ Erreur récupération catégorie:', error)
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
      // Si productData est FormData, utiliser directement
      if (productData instanceof FormData) {
        const response = await api.post('/products/products/', productData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return response.data
      }
      
      // Sinon utiliser l'API normale
      const response = await productsAPI.create(productData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateProduct(id, productData) {
    try {
      // Si productData est FormData, utiliser directement
      if (productData instanceof FormData) {
        const response = await api.put(`/products/products/${id}/`, productData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return response.data
      }
      
      // Sinon utiliser l'API normale
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
      // Essayer plusieurs endpoints
      const endpoints = [
        '/products/my-products/',
        '/my-products/',
        '/api/products/my-products/',
        '/products/?my_products=true'
      ]
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint)
          console.log('✅ Mes produits récupérés depuis:', endpoint)
          return response.data
        } catch (e) {
          console.log(`❌ Échec pour ${endpoint}:`, e.message)
          continue
        }
      }
      
      // Fallback: récupérer tous les produits et filtrer côté client
      console.warn('⚠️ Aucun endpoint "mes produits" trouvé, fallback sur tous les produits')
      const allProducts = await this.getProducts()
      // On suppose que l'utilisateur est connecté et que le backend filtre
      return allProducts
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async toggleFavorite(productId) {
    try {
      // Essayer plusieurs endpoints
      const endpoints = [
        `/products/${productId}/favorite/`,
        `/products/${productId}/toggle-favorite/`,
        `/favorites/${productId}/`
      ]
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.post(endpoint)
          console.log('✅ Favori toggle réussi depuis:', endpoint)
          return response.data
        } catch (e) {
          console.log(`❌ Échec pour ${endpoint}:`, e.message)
          continue
        }
      }
      
      // Essayer avec POST sur /favorites/
      try {
        const response = await api.post('/favorites/', { product_id: productId })
        return response.data
      } catch (error) {
        throw this.handleError(error)
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
      // D'abord, essayer l'endpoint DELETE standard
      try {
        const response = await api.delete('/orders/cart/clear/')
        return response.data
      } catch (error) {
        console.log('⚠️ Endpoint clear/ non trouvé, suppression manuelle...')
        
        // Fallback: supprimer chaque item un par un
        const cartData = await this.getCart()
        const items = cartData.items || []
        
        for (const item of items) {
          await this.removeFromCart(item.id)
        }
        
        return { success: true, message: 'Panier vidé manuellement' }
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 📦 Commandes
  async getOrders() {
    try {
      const response = await ordersAPI.getAll()
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getMyOrders() {
    try {
      const response = await ordersAPI.getMyOrders()
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getFarmerOrders() {
    try {
      // Essayer plusieurs endpoints
      const endpoints = [
        '/orders/farmer-orders/',
        '/orders/my-orders/?farmer=true',
        '/api/orders/farmer-orders/',
        '/orders/?farmer=true'
      ]
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint)
          console.log('✅ Commandes agriculteur récupérées depuis:', endpoint)
          return response.data
        } catch (e) {
          console.log(`❌ Échec pour ${endpoint}:`, e.message)
          continue
        }
      }
      
      // Fallback: récupérer toutes les commandes
      console.warn('⚠️ Aucun endpoint "commandes agriculteur" trouvé, retour vide')
      return []
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createOrder(orderData) {
    try {
      // Format adapté pour Django
      const djangoOrderData = {
        shipping_address: orderData.shipping_address,
        delivery_fee: orderData.delivery_fee || 0,
        notes: orderData.notes || ''
      }
      
      console.log('📤 Création de commande avec données:', djangoOrderData)
      const response = await ordersAPI.create(djangoOrderData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getOrder(id) {
    try {
      const response = await ordersAPI.getById(id)
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

  async updateOrder(orderId, orderData) {
    try {
      const response = await api.patch(`/orders/orders/${orderId}/`, orderData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await ordersAPI.cancelOrder(orderId)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 🚚 LIVRAISONS (pour les livreurs)
  async getDeliveryOrders() {
    try {
      // Essayer l'endpoint spécifique pour livreurs
      const endpoints = [
        '/orders/delivery-orders/',
        '/orders/deliveries/',
        '/delivery/orders/',
        '/api/orders/delivery-orders/'
      ]
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint)
          console.log('✅ Commandes livreur récupérées depuis:', endpoint)
          return response.data
        } catch (e) {
          console.log(`❌ Échec pour ${endpoint}:`, e.message)
          continue
        }
      }
      
      // Fallback: récupérer toutes les commandes avec statut ready ou assigned
      console.warn('⚠️ Aucun endpoint livreur trouvé, fallback sur toutes les commandes')
      const allOrders = await this.getOrders()
      return allOrders.filter(order => 
        ['ready', 'assigned', 'shipped', 'delivered'].includes(order.status)
      )
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async acceptDelivery(orderId) {
    try {
      // Mettre à jour la commande pour l'assigner au livreur courant
      const response = await this.updateOrder(orderId, {
        status: 'assigned',
        delivery_agent: this.user?.id,
        assigned_at: new Date().toISOString()
      })
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async startDelivery(orderId) {
    try {
      const response = await this.updateOrderStatus(orderId, 'shipped')
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async completeDelivery(orderId) {
    try {
      const response = await this.updateOrderStatus(orderId, 'delivered')
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async rejectDelivery(orderId) {
    try {
      // Rejeter une livraison = remettre en status ready
      const response = await this.updateOrderStatus(orderId, 'ready')
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getDeliveryStats() {
    try {
      const endpoints = [
        '/delivery/stats/',
        '/stats/delivery/',
        '/api/delivery/stats/'
      ]
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint)
          return response.data
        } catch (e) {
          continue
        }
      }
      
      // Fallback: calculer les stats côté client
      const orders = await this.getOrders()
      const userOrders = orders.filter(order => 
        order.delivery_agent === this.user?.id
      )
      
      return {
        total: userOrders.length,
        pending: userOrders.filter(o => o.status === 'ready').length,
        assigned: userOrders.filter(o => o.status === 'assigned').length,
        in_progress: userOrders.filter(o => o.status === 'shipped').length,
        delivered: userOrders.filter(o => o.status === 'delivered').length,
        cancelled: userOrders.filter(o => o.status === 'cancelled').length
      }
    } catch (error) {
      console.error('❌ Erreur récupération stats livreur:', error)
      return {
        total: 0,
        pending: 0,
        assigned: 0,
        in_progress: 0,
        delivered: 0,
        cancelled: 0
      }
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

  async searchUsers(query) {
    try {
      const response = await api.get('/auth/users/search/', {
        params: { q: query }
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 💬 CHAT
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

  // 📊 Statistiques
  async getFarmerStats() {
    try {
      // Essayer plusieurs endpoints
      const endpoints = [
        '/farmer/stats/',
        '/stats/farmer/',
        '/api/farmer/stats/',
        '/dashboard/stats/'
      ]
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint)
          console.log('✅ Statistiques récupérées depuis:', endpoint)
          return response.data
        } catch (e) {
          console.log(`❌ Échec pour ${endpoint}:`, e.message)
          continue
        }
      }
      
      // Fallback si l'endpoint n'existe pas
      console.warn('⚠️ Aucun endpoint statistiques trouvé, retour des stats par défaut')
      return {
        total_products: 0,
        total_orders: 0,
        monthly_revenue: 0,
        active_products: 0,
        pending_orders: 0,
        completed_orders: 0
      }
    } catch (error) {
      console.error('❌ Erreur récupération statistiques:', error)
      return {
        total_products: 0,
        total_orders: 0,
        monthly_revenue: 0,
        active_products: 0,
        pending_orders: 0,
        completed_orders: 0
      }
    }
  }

  // 🖼️ Upload d'images multiples pour produits
  async uploadProductImages(productId, images) {
    try {
      const formData = new FormData()
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image)
      })
      
      const response = await api.post(`/products/${productId}/upload-images/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('❌ Erreur upload images:', error)
      throw this.handleError(error)
    }
  }

  // 🔄 Méthode générique pour les requêtes FormData
  async postFormData(endpoint, formData, method = 'post') {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      
      let response
      if (method === 'post') {
        response = await api.post(endpoint, formData, config)
      } else if (method === 'put') {
        response = await api.put(endpoint, formData, config)
      } else if (method === 'patch') {
        response = await api.patch(endpoint, formData, config)
      }
      
      return response.data
    } catch (error) {
      console.error(`❌ Erreur ${method} FormData:`, error)
      throw this.handleError(error)
    }
  }

  // ✅ Vérifier si un endpoint existe
  async checkEndpoint(endpoint) {
    try {
      await api.head(endpoint)
      return true
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false
      }
      throw error
    }
  }

  // 📍 Méthode pour les paramètres d'URL
  async getWithParams(endpoint, params = {}) {
    try {
      const response = await api.get(endpoint, { params })
      return response.data
    } catch (error) {
      console.error(`❌ Erreur GET ${endpoint}:`, error)
      throw this.handleError(error)
    }
  }

  // 🔧 Gestion des erreurs
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
        } else if (firstKey === 'shipping_address' && data[firstKey]) {
          message = `Adresse: ${data[firstKey][0]}`
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

  // 🔐 Vérification d'authentification
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

  // 🔄 Rafraîchir le token
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

  // 🗺️ Utilitaires géographiques (pour les distances)
  async calculateDistance(lat1, lon1, lat2, lon2) {
    // Formule de Haversine pour calculer la distance
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    return distance
  }

  // 📍 Récupérer la localisation de l'utilisateur
  async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'))
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          reject(error)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }

  // 💰 Calculer les frais de livraison
  calculateDeliveryFee(distance, orderAmount = 0) {
    // Formule de base: 500 FCFA minimum + 100 FCFA par km
    const baseFee = 500
    const perKmFee = 100
    const minFee = 500
    const maxFee = 5000
    
    let fee = baseFee + (distance * perKmFee)
    
    // Réduction pour commandes importantes
    if (orderAmount > 10000) {
      fee = fee * 0.9 // 10% de réduction
    }
    
    // Arrondir au multiple de 50
    fee = Math.round(fee / 50) * 50
    
    // Limites min/max
    return Math.max(minFee, Math.min(maxFee, fee))
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