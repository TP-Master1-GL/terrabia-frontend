// src/services/apiService.js
import { 
  authAPI, 
  productsAPI, 
  cartAPI, 
  ordersAPI, 
  usersAPI 
} from '../services/api'

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token')
  }

  // 🔐 Authentification
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials)
      const { access, refresh } = response.data
      
      authAPI.setTokens(access, refresh)
      
      // Récupérer les infos utilisateur
      const userResponse = await this.getCurrentUser()
      return { user: userResponse, token: access }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async register(userData) {
    try {
      const response = await authAPI.register(userData)
      const { access, refresh } = response.data
      
      authAPI.setTokens(access, refresh)
      
      const userResponse = await this.getCurrentUser()
      return { user: userResponse, token: access }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getCurrentUser() {
    try {
      const response = await authAPI.getCurrentUser()
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateProfile(userData) {
    try {
      const response = await authAPI.updateProfile(userData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  logout() {
    authAPI.clearTokens()
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
      const response = await productsAPI.toggleFavorite(productId)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getFavorites() {
    try {
      const response = await productsAPI.getFavorites()
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
      const response = await cartAPI.updateCartItem(itemId, { quantity })
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
      const response = await ordersAPI.updateStatus(orderId, { status })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 👥 Utilisateurs
  async getUsers(params = {}) {
    try {
      const response = await usersAPI.getUsers({ params })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Utilitaires
  handleError(error) {
    if (error.response) {
      const message = error.response.data.detail || 
                     error.response.data.message || 
                     error.response.data.error || 
                     'Erreur serveur'
      throw new Error(message)
    } else if (error.request) {
      throw new Error('Pas de réponse du serveur')
    } else {
      throw new Error(error.message)
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('token')
  }
}

export default new ApiService()