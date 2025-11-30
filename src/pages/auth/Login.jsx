import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  Divider,
  Button
} from '@mui/material'
import {
  Facebook,
  Google,
  Twitter
} from '@mui/icons-material'
import LoginForm from '../../components/auth/LoginForm'
import { useAuth } from '../../contexts/AuthContext'
import logo1 from '../../assets/logo.png';

const Login = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (user && !isLoading) {
      navigate(from, { replace: true })
    }
  }, [user, isLoading, navigate, from])

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8
          }}
        >
          <Paper
            elevation={0}
            sx={{
              padding: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 450,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
            <Typography variant="h6" component="h2" fontWeight="600" gutterBottom>
              Vérification de la session...
            </Typography>
          </Paper>
        </Box>
      </Container>
    )
  }

  // Si l'utilisateur est déjà connecté, ne rien afficher (sera redirigé par useEffect)
  if (user) {
    return null
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 450,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4, width: '100%' }}>
            <Box sx={{ mb: 3 }}>
              <img 
                src={logo1} 
                alt="TERRABIA" 
                style={{ 
                  height: '170px', 
                  marginBottom: '16px',
                  borderRadius: '12px',
                  
                }} 
              />
            
            <Typography variant="h6" component="h2" fontWeight="600" gutterBottom>
              Login to your account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Welcome back! Please enter your details
            </Typography>
            </Box>
          </Box>

          <LoginForm />

          <Box sx={{ mt: 3, width: '100%' }}>
            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary">
                Or login with
              </Typography>
            </Divider>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  sx={{ 
                    py: 1.2,
                    borderRadius: 2,
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(58, 154, 58, 0.04)'
                    }
                  }}
                  onClick={() => {
                    // TODO: Implémenter l'authentification Google
                    console.log('Google login clicked')
                  }}
                >
                  Google
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Facebook />}
                  sx={{ 
                    py: 1.2,
                    borderRadius: 2,
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(58, 154, 58, 0.04)'
                    }
                  }}
                  onClick={() => {
                    // TODO: Implémenter l'authentification Facebook
                    console.log('Facebook login clicked')
                  }}
                >
                  Facebook
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Twitter />}
                  sx={{ 
                    py: 1.2,
                    borderRadius: 2,
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(58, 154, 58, 0.04)'
                    }
                  }}
                  onClick={() => {
                    // TODO: Implémenter l'authentification Twitter
                    console.log('Twitter login clicked')
                  }}
                >
                  Twitter
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Grid container justifyContent="center" sx={{ mt: 4 }}>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#3a9a3a', 
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Register here
                </Link>
              </Typography>
            </Grid>
          </Grid>

          {/* Section d'information supplémentaire */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2, width: '100%' }}>
            <Typography variant="caption" color="textSecondary" display="block" textAlign="center">
              🔒 Votre sécurité est notre priorité. Toutes les données sont cryptées.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login