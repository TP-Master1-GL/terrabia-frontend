// components/auth/ProtectedRoute.jsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Box, CircularProgress, Typography } from '@mui/material'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="primary">
          Chargement...
        </Typography>
      </Box>
    )
  }

  if (!user) {
    // Rediriger vers login avec retour à la page demandée
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Vérifier les rôles si spécifiés
  if (allowedRoles.length > 0) {
    const userRole = user.role || user.user_type
    
    if (!allowedRoles.includes(userRole)) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="50vh"
          flexDirection="column"
          gap={2}
          p={3}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Accès Refusé
          </Typography>
          <Typography variant="body1" textAlign="center">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center">
            Rôle actuel: {userRole}
            <br />
            Rôles autorisés: {allowedRoles.join(', ')}
          </Typography>
        </Box>
      )
    }
  }

  return children
}

export default ProtectedRoute