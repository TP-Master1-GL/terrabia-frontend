// src/services/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://terrabia-mobile.onrender.com/api'

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

// 🔐 API d'authentification - CORRIGÉE
export const authAPI = {
  // Authentification JWT - Format Django SimpleJWT
  login: (credentials) => {
    return api.post('/token/', {
      username: credentials.email, // SimpleJWT utilise 'username'
      password: credentials.password
    })
  },
  
  refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
  
  // Inscription - Format adapté pour votre backend
  register: (userData) => {
    const djangoUserData = {
      // Champs obligatoires pour SimpleJWT/Django
      username: userData.email, // Utiliser l'email comme username
      email: userData.email,
      password: userData.password,
      password_confirm: userData.password,
      
      // Champs personnalisés
      first_name: userData.first_name,
      last_name: userData.last_name,
      user_type: userData.user_type,
      phone_number: userData.phone,
      address: userData.address,
      
      // Champs de profil selon le type d'utilisateur
      farm_name: userData.farm_name || '',
      company_name: userData.company_name || ''
    }
    
    console.log('Données envoyées à Django:', djangoUserData)
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
export const productsAPI = {
  // Récupérer tous les produits (public)
  getAll: (params) => api.get('/products/products/', { params }),
  
  // Récupérer un produit spécifique
  getById: (id) => api.get(`/products/products/${id}/`),
  
  // CRÉER un nouveau produit - CORRIGÉ
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
  
  // Récupérer les produits du farmer connecté - CORRIGÉ
  getMyProducts: () => api.get('/products/my-products/'),
  
  // Rechercher des produits
  search: (query, params = {}) => api.get('/products/products/', { 
    params: { search: query, ...params } 
  }),
}

export const ordersAPI = {
  getAll: (params) => api.get('/orders/orders/', { params }),
  getById: (id) => api.get(`/orders/orders/${id}/`),
  create: (orderData) => api.post('/orders/orders/', orderData),
  updateStatus: (id, status) => api.patch(`/orders/orders/${id}/`, { status }),
  
  // Récupérer les commandes du farmer - NOUVELLE MÉTHODE
  getFarmerOrders: async () => {
    // Comme l'endpoint /farmer-orders/ n'existe pas, on récupère toutes les commandes
    // et on filtre côté client celles qui concernent les produits du farmer
    try {
      const response = await api.get('/orders/orders/')
      const allOrders = response.data || []
      
      // Récupérer les produits du farmer
      const myProductsResponse = await productsAPI.getMyProducts()
      const myProductIds = myProductsResponse.data.map(product => product.id)
      
      // Filtrer les commandes qui contiennent les produits du farmer
      const farmerOrders = allOrders.filter(order => 
        order.items && order.items.some(item => 
          myProductIds.includes(item.product)
        )
      )
      
      return { data: farmerOrders }
    } catch (error) {
      console.error('Error fetching farmer orders:', error)
      return { data: [] }
    }
  },
  
  getMyOrders: () => api.get('/orders/orders/history/'),
  cancelOrder: (id) => api.post(`/orders/orders/${id}/cancel/`),
}


export const cartAPI = {
  getCart: () => api.get('/orders/cart/'),
  addToCart: (productData) => api.post('/orders/cart/add/', productData),
  updateCartItem: (itemId, quantity) => api.patch(`/orders/cart/items/${itemId}/`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/orders/cart/items/${itemId}/remove/`),
  clearCart: () => api.delete('/orders/cart/clear/'),
}

export const ordersAPIw = {
  getAll: (params) => api.get('/orders/orders/', { params }),
  getById: (id) => api.get(`/orders/orders/${id}/`),
  create: (orderData) => api.post('/orders/orders/', orderData),
  updateStatus: (id, status) => api.patch(`/orders/orders/${id}/`, { status }),
  getMyOrders: () => api.get('/orders/orders/history/'),
  getFarmerOrders: () => api.get('/orders/farmer-orders/'),
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
