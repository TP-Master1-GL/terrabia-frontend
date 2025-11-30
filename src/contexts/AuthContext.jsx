// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI, apiUtils } from '../services/api'

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
    if (token) {
      try {
        // Pour l'instant, on vérifie juste si le token existe
        // Plus tard, vous pourrez vérifier sa validité
        console.log('Token exists, user is considered logged in')
      } catch (error) {
        console.error('Auth check failed:', error)
        logout()
      }
    }
    setIsLoading(false)
  }

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Attempting login with:', { email, password })
      
      const response = await authAPI.login({ email, password })
      console.log('Login response:', response.data)
      
      const { access, refresh } = response.data
      
      // Sauvegarder les tokens
      authAPI.setTokens(access, refresh)
      
      // Créer un objet utilisateur temporaire
      // Vous devrez récupérer les vraies infos depuis votre API
      const tempUser = {
        id: 1,
        first_name: 'Utilisateur',
        last_name: 'Test',
        email: email,
        user_type: 'buyer'
      }
      
      setUser(tempUser)
      localStorage.setItem('terrabia_user', JSON.stringify(tempUser))
      
      return { success: true, user: tempUser }
    } catch (error) {
      console.error('Login error:', error)
      const errorData = apiUtils.handleError(error)
      
      let errorMessage = 'Échec de la connexion'
      
      // Gestion spécifique des erreurs Django
      if (errorData.detail) {
        errorMessage = errorData.detail
      } else if (errorData.non_field_errors) {
        errorMessage = errorData.non_field_errors[0]
      } else if (errorData.username) {
        errorMessage = `Nom d'utilisateur: ${errorData.username[0]}`
      } else if (errorData.password) {
        errorMessage = `Mot de passe: ${errorData.password[0]}`
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
      
      const response = await authAPI.register(userData)
      console.log('Register response:', response.data)
      
      // Si l'inscription réussit
      if (response.data.access) {
        // Connexion automatique si token reçu
        const { access, refresh } = response.data
        authAPI.setTokens(access, refresh)
        
        const newUser = {
          ...userData,
          id: response.data.user?.id || Date.now()
        }
        
        setUser(newUser)
        localStorage.setItem('terrabia_user', JSON.stringify(newUser))
        
        return { success: true, user: newUser }
      } else {
        // Redirection vers login si pas de token
        return { success: true, requiresLogin: true }
      }
    } catch (error) {
      console.error('Register error:', error)
      const errorData = apiUtils.handleError(error)
      
      let errorMessage = 'Échec de l\'inscription'
      
      // Gestion spécifique des erreurs Django
      if (errorData.email) {
        errorMessage = `Email: ${errorData.email[0]}`
      } else if (errorData.password) {
        errorMessage = `Mot de passe: ${errorData.password[0]}`
      } else if (errorData.non_field_errors) {
        errorMessage = errorData.non_field_errors[0]
      } else if (errorData.detail) {
        errorMessage = errorData.detail
      } else if (typeof errorData === 'object') {
        // Si c'est un objet avec plusieurs erreurs
        errorMessage = Object.values(errorData).flat().join(', ')
      }
      
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authAPI.clearTokens()
    localStorage.removeItem('terrabia_user')
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}