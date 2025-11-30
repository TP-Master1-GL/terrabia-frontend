// components/auth/LoginForm.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Adresse email invalide')
    .required('L\'email est requis'),
  password: yup
    .string()
    .min(1, 'Le mot de passe est requis')
    .required('Le mot de passe est requis')
})

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { login, isLoading, error } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password)
    
    if (result.success) {
      // Redirection basée sur le user_type de Django
      const userType = result.user?.user_type
      
      if (userType === 'admin') {
        navigate('/admin')
      } else if (userType === 'farmer') {
        navigate('/farmer')
      } else if (userType === 'delivery') {
        navigate('/delivery')
      } else {
        navigate('/customer') // Pour 'buyer' et autres types
      }
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
          Email Address
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter your email"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            }
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
          Password
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter your password"
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: 'text.secondary' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              sx={{
                color: 'primary.main',
                '&.Mui-checked': {
                  color: 'primary.main',
                },
              }}
            />
          }
          label={
            <Typography variant="body2" color="text.primary">
              Remember me
            </Typography>
          }
        />
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'primary.main', 
            textDecoration: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Forgot password?
        </Typography>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{ 
          py: 1.5,
          borderRadius: 2,
          fontSize: '1rem',
          fontWeight: '600',
          textTransform: 'none',
          background: 'linear-gradient(45deg, #3a9a3a, #2a7a2a)',
          boxShadow: '0 4px 12px rgba(58, 154, 58, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #2a7a2a, #1a5a1a)',
            boxShadow: '0 6px 16px rgba(58, 154, 58, 0.4)',
            transform: 'translateY(-1px)'
          },
          '&:disabled': {
            background: 'grey.300'
          }
        }}
      >
        {isLoading ? 'Signing in...' : 'Login'}
      </Button>

      {/* Comptes de test mis à jour pour Django */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom color="text.primary">
          Comptes de test Django:
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Utilisez les comptes créés dans votre base Django
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
          Format: email / mot de passe
        </Typography>
      </Box>
    </Box>
  )
}

export default LoginForm