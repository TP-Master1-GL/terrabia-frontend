// src/services/api.js
import axios from 'axios'

const API_BASE_URL = 'https://terrabia-mobile.onrender.com/api'

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

// Intercepteur pour gérer les erreurs et rafraîchir le token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    console.error('API Error:', error.response?.data || error.message)
    
    // Si erreur 401 (token expiré), essayer de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        
        // Rafraîchir le token
        const response = await api.post('/token/refresh/', { 
          refresh: refreshToken 
        })
        
        const { access, refresh } = response.data
        
        // Sauvegarder les nouveaux tokens
        localStorage.setItem('token', access)
        if (refresh) {
          localStorage.setItem('refresh_token', refresh)
        }
        
        // Retenter la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
        
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
    }
    
    // Pour les autres erreurs, juste logger et rejeter
    if (error.response?.status === 403) {
      console.error('Accès refusé - vérifiez vos permissions')
    }
    
    return Promise.reject(error)
  }
)

// 🔐 API d'authentification
export const authAPI = {
  login: async (credentials) => {
    try {
      // Essayer d'abord /auth/login/
      const response = await api.post('/auth/login/', {
        email: credentials.email,
        password: credentials.password
      })
      console.log('✅ Login réussi via /auth/login/')
      return response
    } catch (customError) {
      console.log('❌ /auth/login/ échoué, tentative avec /token/...')
      
      try {
        const jwtResponse = await api.post('/token/', {
          username: credentials.email,
          password: credentials.password
        })
        console.log('✅ Login réussi via /token/')
        return jwtResponse
      } catch (jwtError) {
        console.log('❌ Les deux méthodes de login ont échoué')
        throw jwtError
      }
    }
  },
  
  refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
  
  register: (userData) => {
    const djangoUserData = {
      username: userData.username || userData.email.split('@')[0] + Date.now(),
      email: userData.email,
      password: userData.password,
      password_confirm: userData.password_confirm || userData.password,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      user_type: userData.user_type || 'buyer',
      phone_number: userData.phone_number || userData.phone || '',
      ...(userData.address && { address: userData.address }),
      ...(userData.farm_name && { farm_name: userData.farm_name }),
      ...(userData.company_name && { company_name: userData.company_name })
    }
    
    console.log('📤 Données d\'inscription envoyées:', djangoUserData)
    return api.post('/auth/register/', djangoUserData)
  },
  
  verifyToken: () => api.get('/auth/verify/'),
  
  getCurrentUser: async () => {
    const endpoints = ['/auth/users/me/', '/auth/me/', '/auth/user/', '/users/me/']
    
    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint)
        console.log(`✅ User récupéré via ${endpoint}`)
        return response
      } catch (error) {
        console.log(`❌ ${endpoint} - ${error.response?.status || error.message}`)
        continue
      }
    }
    throw new Error('Aucun endpoint utilisateur trouvé')
  },
  
  setTokens: (access, refresh) => {
    localStorage.setItem('token', access)
    localStorage.setItem('refresh_token', refresh)
    console.log('🔑 Tokens sauvegardés')
  },
  
  clearTokens: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    console.log('🧹 Tokens supprimés')
  }
}

export const productsAPI = {
  getAll: (params) => api.get('/products/products/', { params }),
  getById: (id) => api.get(`/products/products/${id}/`),
  create: (productData) => {
    const config = productData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {}
    return api.post('/products/products/', productData, config)
  },
  update: (id, productData) => {
    const config = productData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {}
    return api.patch(`/products/products/${id}/`, productData, config)
  },
  delete: (id) => api.delete(`/products/products/${id}/`),
  getCategories: () => api.get('/products/categories/'),
  getMyProducts: () => api.get('/products/my-products/'),
  search: (query, params = {}) => api.get('/products/products/', { 
    params: { search: query, ...params } 
  }),
}

export const cartAPI = {
  getCart: () => api.get('/orders/cart/'),
  addToCart: (productData) => api.post('/orders/cart/add/', productData),
  updateCartItem: (itemId, quantity) => api.patch(`/orders/cart/items/${itemId}/`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/orders/cart/items/${itemId}/remove/`),
  clearCart: () => api.delete('/orders/cart/clear/'),
}

export const ordersAPI = {
  getAll: (params) => api.get('/orders/orders/', { params }),
  getById: (id) => api.get(`/orders/orders/${id}/`),
  create: (orderData) => api.post('/orders/orders/', orderData),
  updateStatus: (id, status) => api.patch(`/orders/orders/${id}/`, { status }),
  getMyOrders: () => api.get('/orders/orders/history/'),
  
  // Pour les agriculteurs
  getFarmerOrders: async () => {
    try {
      const response = await api.get('/orders/farmer-orders/')
      console.log('✅ Endpoint farmer-orders trouvé')
      return response
    } catch (error) {
      console.log('❌ Endpoint farmer-orders non trouvé, filtre côté client...')
      
      try {
        const allOrdersResponse = await api.get('/orders/orders/')
        const allOrders = allOrdersResponse.data || []
        
        const myProductsResponse = await api.get('/products/my-products/')
        const myProductIds = myProductsResponse.data.map(product => product.id)
        
        const farmerOrders = allOrders.filter(order => 
          order.items && order.items.some(item => 
            myProductIds.includes(item.product)
          )
        )
        
        return { data: farmerOrders }
      } catch (innerError) {
        console.error('❌ Erreur lors de la récupération:', innerError)
        return { data: [] }
      }
    }
  },
  
  // Pour les livreurs
  getDeliveryOrders: async () => {
    try {
      // Essayer l'endpoint spécifique pour livreurs
      const response = await api.get('/orders/delivery-orders/')
      console.log('✅ Endpoint delivery-orders trouvé')
      return response
    } catch (error) {
      console.log('❌ Endpoint delivery-orders non trouvé, filtre côté client...')
      
      try {
        const allOrdersResponse = await api.get('/orders/orders/')
        const allOrders = allOrdersResponse.data || []
        
        // Commandes prêtes pour livraison ou assignées au livreur courant
        const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id
        const deliveryOrders = allOrders.filter(order => 
          ['ready', 'assigned', 'shipped', 'delivered'].includes(order.status) &&
          (!order.delivery_agent || order.delivery_agent === userId)
        )
        
        return { data: deliveryOrders }
      } catch (innerError) {
        console.error('❌ Erreur lors de la récupération:', innerError)
        return { data: [] }
      }
    }
  },
  
  assignDelivery: (orderId, deliveryAgentId) => 
    api.patch(`/orders/orders/${orderId}/`, { 
      delivery_agent: deliveryAgentId,
      status: 'assigned'
    }),
  
  updateDeliveryStatus: (orderId, status) => 
    api.patch(`/orders/orders/${orderId}/`, { status }),
  
  getOrderDetails: (orderId) => api.get(`/orders/orders/${orderId}/`),
  
  cancelOrder: (id) => api.post(`/orders/orders/${id}/cancel/`),
  
  // Statistiques pour livreurs
  getDeliveryStats: async () => {
    try {
      const response = await api.get('/orders/delivery-stats/')
      return response
    } catch (error) {
      console.log('❌ Endpoint delivery-stats non trouvé')
      
      // Fallback: calculer les stats côté client
      try {
        const allOrdersResponse = await api.get('/orders/orders/')
        const allOrders = allOrdersResponse.data || []
        const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id
        
        const userOrders = allOrders.filter(order => 
          order.delivery_agent === userId
        )
        
        const stats = {
          total: userOrders.length,
          pending: userOrders.filter(o => o.status === 'ready').length,
          assigned: userOrders.filter(o => o.status === 'assigned').length,
          in_progress: userOrders.filter(o => o.status === 'shipped').length,
          delivered: userOrders.filter(o => o.status === 'delivered').length,
          cancelled: userOrders.filter(o => o.status === 'cancelled').length
        }
        
        return { data: stats }
      } catch (innerError) {
        console.error('❌ Erreur calcul stats:', innerError)
        return { 
          data: {
            total: 0,
            pending: 0,
            assigned: 0,
            in_progress: 0,
            delivered: 0,
            cancelled: 0
          }
        }
      }
    }
  }
}

export const usersAPI = {
  getUsers: (params) => api.get('/auth/users/', { params }),
  getUser: (userId) => api.get(`/auth/users/${userId}/`),
  updateUser: (userData) => api.patch('/auth/users/me/', userData),
  searchUsers: (query) => api.get('/auth/users/search/', { params: { q: query } }),
  getDeliveryAgents: () => api.get('/auth/users/?user_type=delivery'),
}

export const deliveryAPI = {
  // Récupérer les commandes disponibles pour livraison
  getAvailableOrders: () => api.get('/orders/delivery/available/'),
  
  // Accepter une livraison
  acceptOrder: (orderId) => api.post(`/orders/delivery/${orderId}/accept/`),
  
  // Rejeter une livraison
  rejectOrder: (orderId) => api.post(`/orders/delivery/${orderId}/reject/`),
  
  // Démarrer une livraison
  startDelivery: (orderId) => api.post(`/orders/delivery/${orderId}/start/`),
  
  // Compléter une livraison
  completeDelivery: (orderId) => api.post(`/orders/delivery/${orderId}/complete/`),
  
  // Mettre à jour la position GPS
  updateLocation: (latitude, longitude) => 
    api.post('/delivery/location/', { latitude, longitude }),
  
  // Récupérer l'historique des livraisons
  getHistory: (params) => api.get('/orders/delivery/history/', { params }),
  
  // Récupérer les détails d'une livraison
  getDeliveryDetails: (orderId) => api.get(`/orders/delivery/${orderId}/`),
  
  // Récupérer les statistiques du livreur
  getStats: () => api.get('/delivery/stats/'),
}

export const reviewsAPI = {
  getReviews: (params) => api.get('/orders/reviews/', { params }),
  createReview: (reviewData) => api.post('/orders/reviews/', reviewData),
  getMyReviews: () => api.get('/orders/reviews/my/'),
  getReviewsForUser: (userId) => api.get(`/orders/reviews/user/${userId}/`),
}

export const chatAPI = {
  getConversations: () => api.get('/chat/conversations/'),
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}/messages/`),
  sendMessage: (conversationId, content) => 
    api.post(`/chat/conversations/${conversationId}/messages/`, { content }),
  markAsRead: (conversationId) => api.post(`/chat/conversations/${conversationId}/mark_read/`),
  createConversation: (participantId) => 
    api.post('/chat/conversations/', { participant_id: participantId }),
  getUnreadCount: () => api.get('/chat/unread_count/'),
}

export const notificationsAPI = {
  getNotifications: () => api.get('/notifications/'),
  markAsRead: (notificationId) => api.post(`/notifications/${notificationId}/mark_read/`),
  markAllAsRead: () => api.post('/notifications/mark_all_read/'),
  getUnreadCount: () => api.get('/notifications/unread_count/'),
}

// API utilitaires pour les fonctionnalités avancées
export const locationAPI = {
  getAddressFromCoords: (latitude, longitude) =>
    api.get(`/location/reverse-geocode/?lat=${latitude}&lon=${longitude}`),
  
  getCoordsFromAddress: (address) =>
    api.get(`/location/geocode/?address=${encodeURIComponent(address)}`),
  
  calculateDistance: (origin, destination) =>
    api.post('/location/distance/', { origin, destination }),
}

export const paymentAPI = {
  createPaymentIntent: (orderId, amount) =>
    api.post('/payments/create-intent/', { order_id: orderId, amount }),
  
  confirmPayment: (paymentId) =>
    api.post(`/payments/${paymentId}/confirm/`),
  
  getPaymentMethods: () => api.get('/payments/methods/'),
  
  getPaymentHistory: () => api.get('/payments/history/'),
}

// Utility functions
export const apiUtils = {
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token && token !== 'null' && token !== 'undefined'
  },
  
  getToken: () => {
    return localStorage.getItem('token')
  },
  
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },
  
  handleError: (error) => {
    if (error.response) {
      return error.response.data
    } else if (error.request) {
      return { message: 'Pas de réponse du serveur. Vérifiez votre connexion internet.' }
    } else {
      return { message: error.message }
    }
  },
  
  // Formater les dates pour l'affichage
  formatDate: (dateString, includeTime = true) => {
    if (!dateString) return 'Date inconnue'
    
    const date = new Date(dateString)
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }
    
    if (includeTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }
    
    return date.toLocaleDateString('fr-FR', options)
  },
  
  // Formater les prix
  formatPrice: (price) => {
    const num = parseFloat(price || 0)
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  },
  
  // Calculer la distance entre deux coordonnées (Haversine)
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  },
  
  // Calculer les frais de livraison basés sur la distance
  calculateDeliveryFee: (distance, orderAmount = 0) => {
    const baseFee = 500 // FCFA
    const perKmFee = 100 // FCFA par km
    const minFee = 500 // FCFA minimum
    const maxFee = 5000 // FCFA maximum
    
    let fee = baseFee + (distance * perKmFee)
    
    // Réduction pour commandes importantes
    if (orderAmount > 10000) {
      fee = fee * 0.9 // 10% de réduction
    }
    
    // Arrondir au multiple de 50
    fee = Math.round(fee / 50) * 50
    
    // Appliquer les limites
    return Math.max(minFee, Math.min(maxFee, fee))
  },
  
  // Vérifier si un objet est vide
  isEmpty: (obj) => {
    return Object.keys(obj).length === 0
  },
  
  // Délayer l'exécution (pour les requêtes multiples)
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Retry une fonction plusieurs fois
  retry: async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn()
      } catch (error) {
        if (i === retries - 1) throw error
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
}

export default api