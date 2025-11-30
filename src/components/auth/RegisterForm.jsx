// components/auth/RegisterForm.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  LocationOn,
  Business,
  Agriculture
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirm: '',
    user_type: 'buyer',
    farm_name: '',
    company_name: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, error, clearError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Nettoyer les erreurs au démontage
    return () => {
      clearError()
    }
  }, [clearError])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.first_name.trim()) errors.first_name = 'Le prénom est requis'
    if (!formData.last_name.trim()) errors.last_name = 'Le nom est requis'
    
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format d\'email invalide'
    }
    
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    if (!formData.password_confirm) {
      errors.password_confirm = 'La confirmation du mot de passe est requise'
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Les mots de passe ne correspondent pas'
    }
    
    if (formData.user_type === 'farmer' && !formData.farm_name.trim()) {
      errors.farm_name = 'Le nom de la ferme est requis pour les agriculteurs'
    }
    
    if (formData.user_type === 'delivery' && !formData.company_name.trim()) {
      errors.company_name = 'Le nom de l\'entreprise est requis pour les livreurs'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    const result = await register(formData)
    
    if (result.success) {
      // Redirection gérée par le composant parent
      console.log('Registration successful, redirecting...')
    } else {
      console.log('Registration failed:', result.message)
    }

    setIsSubmitting(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const getUserTypeIcon = () => {
    switch (formData.user_type) {
      case 'farmer':
        return <Agriculture />
      case 'delivery':
        return <Business />
      default:
        return <Person />
    }
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

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="first_name"
            label="Prénom"
            value={formData.first_name}
            onChange={handleChange}
            error={!!formErrors.first_name}
            helperText={formErrors.first_name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="last_name"
            label="Nom"
            value={formData.last_name}
            onChange={handleChange}
            error={!!formErrors.last_name}
            helperText={formErrors.last_name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="email"
            label="Adresse email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="phone"
            label="Téléphone"
            value={formData.phone}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Type de compte *</InputLabel>
            <Select
              name="user_type"
              value={formData.user_type}
              label="Type de compte *"
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  {getUserTypeIcon()}
                </InputAdornment>
              }
            >
              <MenuItem value="buyer">Acheteur</MenuItem>
              <MenuItem value="farmer">Agriculteur</MenuItem>
              <MenuItem value="delivery">Livreur</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="address"
            label="Adresse"
            multiline
            rows={2}
            value={formData.address}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        {formData.user_type === 'farmer' && (
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="farm_name"
              label="Nom de la ferme"
              value={formData.farm_name}
              onChange={handleChange}
              error={!!formErrors.farm_name}
              helperText={formErrors.farm_name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Agriculture color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}
        
        {formData.user_type === 'delivery' && (
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="company_name"
              label="Nom de l'entreprise"
              value={formData.company_name}
              onChange={handleChange}
              error={!!formErrors.company_name}
              helperText={formErrors.company_name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            InputProps={{
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
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="password_confirm"
            label="Confirmer le mot de passe"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.password_confirm}
            onChange={handleChange}
            error={!!formErrors.password_confirm}
            helperText={formErrors.password_confirm}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
        size="large"
        sx={{
          mt: 3,
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
          'Créer mon compte'
        )}
      </Button>
    </Box>
  )
}

export default RegisterForm