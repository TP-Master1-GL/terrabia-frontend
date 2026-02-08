// src/components/Layout/DeliveryLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Container, Paper, AppBar, Toolbar, Typography, Button } from '@mui/material'
import { LocalShipping, ExitToApp, Dashboard, History } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const DeliveryLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* En-tête */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <LocalShipping sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Terrabia - Livreur
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.first_name} {user?.last_name}
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<ExitToApp />}
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>

      {/* Navigation */}
      <Paper sx={{ borderRadius: 0, borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', gap: 1, py: 1 }}>
            <Button
              startIcon={<Dashboard />}
              onClick={() => navigate('/delivery/dashboard')}
            >
              Tableau de bord
            </Button>
            <Button
              startIcon={<History />}
              onClick={() => navigate('/delivery/history')}
            >
              Historique
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Contenu principal */}
      <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>

      {/* Pied de page */}
      <Paper 
        component="footer" 
        sx={{ 
          mt: 'auto', 
          py: 2, 
          borderRadius: 0,
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="textSecondary" align="center">
            © {new Date().getFullYear()} Terrabia - Plateforme de livraison
          </Typography>
        </Container>
      </Paper>
    </Box>
  )
}

export default DeliveryLayout