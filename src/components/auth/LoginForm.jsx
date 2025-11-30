// components/auth/LoginForm.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, error, clearError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Charger les informations "remember me" depuis le localStorage
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }

    // Nettoyer les erreurs au démontage
    return () => {
      clearError()
    }
  }, [clearError])

  const validateForm = () => {
    const errors = {}
    
    if (!email.trim()) {
      errors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Format d\'email invalide'
    }
    
    if (!password) {
      errors.password = 'Le mot de passe est requis'
    } else if (password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Sauvegarder l'email si "remember me" est coché
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email)
    } else {
      localStorage.removeItem('rememberedEmail')
    }

    const result = await login(email, password)
    
    if (result.success) {
      // Redirection gérée par le composant parent
      console.log('Login successful, redirecting...')
    } else {
      // Les erreurs sont gérées par le AuthContext
      console.log('Login failed:', result.message)
    }

    setIsSubmitting(false)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (formErrors.email) {
      setFormErrors(prev => ({ ...prev, email: '' }))
    }
    clearError()
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (formErrors.password) {
      setFormErrors(prev => ({ ...prev, password: '' }))
    }
    clearError()
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleForgotPassword = () => {
    // TODO: Implémenter la récupération de mot de passe
    console.log('Forgot password clicked')
    // navigate('/forgot-password')
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Adresse email"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={handleEmailChange}
        error={!!formErrors.email}
        helperText={formErrors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={handlePasswordChange}
        error={!!formErrors.password}
        helperText={formErrors.password}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={togglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 1 }}
      />

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <FormControlLabel
          control={
            <Checkbox 
              value="remember" 
              color="primary" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          }
          label="Se souvenir de moi"
        />
        
        <Button 
          variant="text" 
          size="small"
          onClick={handleForgotPassword}
          sx={{ 
            color: 'text.secondary',
            textTransform: 'none',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'transparent'
            }
          }}
        >
          Mot de passe oublié ?
        </Button>
      </Box>
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
        size="large"
        sx={{
          mt: 1,
          mb: 2,
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: '600',
          background: 'linear-gradient(45deg, #3a9a3a 30%, #2d7a2d 90%)',
          boxShadow: '0 3px 5px 2px rgba(58, 154, 58, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #2d7a2d 30%, #1f5a1f 90%)',
            boxShadow: '0 3px 5px 2px rgba(45, 122, 45, .3)',
          },
          '&:disabled': {
            background: 'grey.400',
            boxShadow: 'none'
          }
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Se connecter'
        )}
      </Button>
    </Box>
  )
}

export default LoginForm