// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI, apiUtils } from '../services/api'
import apiService from '../services/apiService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token')
    if (token && apiService.isAuthenticated()) {
      try {
        // Récupérer les vraies infos utilisateur depuis l'API
        const userData = await apiService.getCurrentUser()
        console.log('User data from API:', userData)
        setUser(userData)
        localStorage.setItem('terrabia_user', JSON.stringify(userData))
      } catch (error) {
        console.error('Auth check failed:', error)
        // Si le token est invalide, déconnecter l'utilisateur
        if (error.response?.status === 401) {
          logout()
        }
      }
    }
    setIsLoading(false)
  }

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Attempting login with:', { email, password })
      
      // Utiliser le service API amélioré
      const { user: userData, token } = await apiService.login({ email, password })
      console.log('Login successful:', userData)
      
      setUser(userData)
      localStorage.setItem('terrabia_user', JSON.stringify(userData))
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Login error:', error)
      
      let errorMessage = 'Échec de la connexion'
      
      // Gestion spécifique des erreurs Django
      if (error.message) {
        errorMessage = error.message
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors[0]
      }
      
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Attempting registration with:', userData)
      
      // Utiliser le service API amélioré
      const { user: newUser, token } = await apiService.register(userData)
      console.log('Register successful:', newUser)
      
      setUser(newUser)
      localStorage.setItem('terrabia_user', JSON.stringify(newUser))
      
      return { success: true, user: newUser }
    } catch (error) {
      console.error('Register error:', error)
      
      let errorMessage = 'Échec de l\'inscription'
      
      // Gestion spécifique des erreurs Django
      if (error.message) {
        errorMessage = error.message
      } else if (error.response?.data?.email) {
        errorMessage = `Email: ${error.response.data.email[0]}`
      } else if (error.response?.data?.password) {
        errorMessage = `Mot de passe: ${error.response.data.password[0]}`
      } else if (error.response?.data?.username) {
        errorMessage = `Nom d'utilisateur: ${error.response.data.username[0]}`
      } else if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors[0]
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      }
      
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem('terrabia_user', JSON.stringify(updatedUser))
  }

  const logout = () => {
    apiService.logout()
    localStorage.removeItem('terrabia_user')
    setUser(null)
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isAuthenticated: !!user && !!localStorage.getItem('token')
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}