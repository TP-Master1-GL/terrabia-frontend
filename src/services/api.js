// src/services/api.js
import axios from 'axios'

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://terrabia-mobile.onrender.com/api'
const API_BASE_URL = 'http://127.0.0.1:8000/api/'

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

// 🔐 API d'authentification - COMPLÈTEMENT CORRIGÉE
export const authAPI = {
  // Méthode UNIQUE pour login qui essaie les 2 endpoints possibles
  login: async (credentials) => {
    // Votre backend semble avoir un endpoint custom /auth/login/
    // mais il pourrait aussi avoir l'endpoint SimpleJWT standard /token/
    
    // Essayons d'abord l'endpoint custom /auth/login/
    try {
      console.log('Tentative de login avec /auth/login/...')
      const response = await api.post('/auth/login/', {
        email: credentials.email,    // Votre backend Django semble attendre 'email'
        password: credentials.password
      })
      console.log('✅ Login réussi via /auth/login/')
      return response
    } catch (customError) {
      console.log('❌ /auth/login/ échoué, tentative avec /token/...', customError.response?.data)
      
      // Fallback: Essayons l'endpoint SimpleJWT standard
      try {
        // Pour SimpleJWT, nous devons utiliser 'username' au lieu de 'email'
        const jwtResponse = await api.post('/token/', {
          username: credentials.email,  // SimpleJWT utilise 'username'
          password: credentials.password
        })
        console.log('✅ Login réussi via /token/')
        return jwtResponse
      } catch (jwtError) {
        console.log('❌ Les deux méthodes de login ont échoué')
        throw jwtError // Lance l'erreur pour qu'elle soit traitée par l'appelant
      }
    }
  },
  
  refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
  
  // Inscription - Format adapté pour votre backend
  register: (userData) => {
    const djangoUserData = {
      // Champs obligatoires pour votre serializer
      username: userData.username || userData.email.split('@')[0] + Date.now(), // Générer un username unique
      email: userData.email,
      password: userData.password,
      password_confirm: userData.password_confirm || userData.password,
      
      // Champs personnalisés
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      user_type: userData.user_type || 'buyer',
      phone_number: userData.phone_number || userData.phone || '',
      
      // Champs optionnels
      ...(userData.address && { address: userData.address }),
      ...(userData.farm_name && { farm_name: userData.farm_name }),
      ...(userData.company_name && { company_name: userData.company_name })
    }
    
    console.log('📤 Données d\'inscription envoyées:', djangoUserData)
    return api.post('/auth/register/', djangoUserData)
  },
  
  // Vérification du token et récupération de l'utilisateur
  verifyToken: () => api.get('/auth/verify/'),
  getCurrentUser: async () => {
    // Essayez plusieurs endpoints possibles
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
  
  // Gestion des tokens
  setTokens: (access, refresh) => {
    localStorage.setItem('token', access)
    localStorage.setItem('refresh_token', refresh)
    console.log('🔑 Tokens sauvegardés dans localStorage')
  },
  clearTokens: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    console.log('🧹 Tokens supprimés')
  }
}

export const productsAPI = {
  // Récupérer tous les produits (public)
  getAll: (params) => api.get('/products/products/', { params }),
  
  // Récupérer un produit spécifique
  getById: (id) => api.get(`/products/products/${id}/`),
  
  // CRÉER un nouveau produit
  create: (productData) => {
    const config = productData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {}
    return api.post('/products/products/', productData, config)
  },
  
  // MODIFIER un produit
  update: (id, productData) => {
    const config = productData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {}
    return api.patch(`/products/products/${id}/`, productData, config)
  },
  
  // SUPPRIMER un produit
  delete: (id) => api.delete(`/products/products/${id}/`),
  
  // Récupérer les catégories
  getCategories: () => api.get('/products/categories/'),
  
  // Récupérer les produits du farmer connecté
  getMyProducts: () => api.get('/products/my-products/'),
  
  // Rechercher des produits
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
  
  // Méthode pour récupérer les commandes du farmer
  getFarmerOrders: async () => {
    try {
      // D'abord, vérifiez si l'endpoint farmer-orders existe
      try {
        const response = await api.get('/orders/farmer-orders/')
        console.log('✅ Endpoint farmer-orders trouvé')
        return response
      } catch (endpointError) {
        console.log('❌ Endpoint farmer-orders non trouvé, filtre côté client...')
        // Fallback: Récupérer toutes les commandes et filtrer
        const allOrdersResponse = await api.get('/orders/orders/')
        const allOrders = allOrdersResponse.data || []
        
        // Récupérer les produits du farmer
        const myProductsResponse = await api.get('/products/my-products/')
        const myProductIds = myProductsResponse.data.map(product => product.id)
        
        // Filtrer les commandes
        const farmerOrders = allOrders.filter(order => 
          order.items && order.items.some(item => 
            myProductIds.includes(item.product)
          )
        )
        
        return { data: farmerOrders }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des commandes farmer:', error)
      return { data: [] }
    }
  },
  
  cancelOrder: (id) => api.post(`/orders/orders/${id}/cancel/`),
}

export const usersAPI = {
  getUsers: (params) => api.get('/auth/users/', { params }),
  getUser: (userId) => api.get(`/auth/users/${userId}/`),
  updateUser: (userData) => api.patch('/auth/users/me/', userData),
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
    localStorage.removeItem('user')
    window.location.href = '/login'
  },
  
  handleError: (error) => {
    if (error.response) {
      return error.response.data
    } else if (error.request) {
      return { message: 'Pas de réponse du serveur' }
    } else {
      return { message: error.message }
    }
  }
}

export default api