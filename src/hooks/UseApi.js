// hooks/useAuth.js
import { useAuth } from '../contexts/AuthContext'

export const useAuthHook = () => {
  const auth = useAuth()
  
  const loginUser = async (email, password) => {
    return await auth.login(email, password)
  }

  const registerUser = async (userData) => {
    return await auth.register(userData)
  }

  const logoutUser = () => {
    auth.logout()
  }

  const updateUserProfile = (userData) => {
    auth.updateUser(userData)
  }

  return {
    user: auth.user,
    isLoading: auth.isLoading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    updateUser: updateUserProfile,
    clearError: auth.clearError
  }
}