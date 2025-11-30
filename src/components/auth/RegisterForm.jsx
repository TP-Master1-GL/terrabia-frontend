// components/auth/RegisterForm.jsx
import React, { useState, useEffect } from 'react'
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
  Lock,
  Business,
  Phone,
  LocationOn
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useSearchParams, useNavigate } from 'react-router-dom'

const registerSchema = yup.object({
  first_name: yup.string().required('Le prénom est requis'),
  last_name: yup.string().required('Le nom est requis'),
  email: yup
    .string()
    .email('Adresse email invalide')
    .required('L\'email est requis'),
  password: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise'),
  user_type: yup.string().required('Le type d\'utilisateur est requis'),
  phone: yup.string().required('Le numéro de téléphone est requis'),
  address: yup.string().required('L\'adresse est requise')
})

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isLoading, error } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema)
  })

  const userType = watch('user_type')

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'farmer' || type === 'buyer') {
      setValue('user_type', type)
    }
  }, [searchParams, setValue])

  const onSubmit = async (data) => {
    // Préparer les données pour l'API Django
    const userData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      user_type: data.user_type,
      phone: data.phone,
      address: data.address,
      farm_name: data.farmName || ''
    }

    const result = await registerUser(userData)
    
    if (result.success) {
      if (!result.requiresLogin) {
        // Redirection automatique après inscription
        const userRole = result.user?.user_type || result.user?.role
        if (userRole === 'farmer') {
          navigate('/farmer')
        } else if (userRole === 'delivery') {
          navigate('/delivery')
        } else {
          navigate('/customer')
        }
      } else {
        // Redirection vers la page de login
        navigate('/login')
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

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
            Prénom
          </Typography>
          <TextField
            fullWidth
            placeholder="Entrez votre prénom"
            {...register('first_name')}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: 'text.secondary' }} />
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
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
            Nom
          </Typography>
          <TextField
            fullWidth
            placeholder="Entrez votre nom"
            {...register('last_name')}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: 'text.secondary' }} />
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
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
            Email
          </Typography>
          <TextField
            fullWidth
            placeholder="Entrez votre email"
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
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
            Mot de passe
          </Typography>
          <TextField
            fullWidth
            placeholder="Créez un mot de passe"
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
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
            Confirmer le mot de passe
          </Typography>
          <TextField
            fullWidth
            placeholder="Confirmez votre mot de passe"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: 'text.secondary' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
            Je suis
          </Typography>
          <FormControl fullWidth error={!!errors.user_type}>
            <InputLabel>Sélectionnez votre rôle</InputLabel>
            <Select
              {...register('user_type')}
              label="Sélectionnez votre rôle"
              defaultValue=""
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            >
              <MenuItem value="buyer">Acheteur</MenuItem>
              <MenuItem value="farmer">Agriculteur</MenuItem>
              <MenuItem value="delivery">Livreur</MenuItem>
            </Select>
            {errors.user_type && (
              <Typography variant="caption" color="error">
                {errors.user_type.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
            Téléphone
          </Typography>
          <TextField
            fullWidth
            placeholder="Entrez votre numéro de téléphone"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone sx={{ color: 'text.secondary' }} />
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
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
            Adresse
          </Typography>
          <TextField
            fullWidth
            placeholder="Entrez votre adresse complète"
            multiline
            rows={2}
            {...register('address')}
            error={!!errors.address}
            helperText={errors.address?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn sx={{ color: 'text.secondary', mt: -2 }} />
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
        </Grid>

        {userType === 'farmer' && (
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: 'text.primary' }}>
              Nom de la ferme (Optionnel)
            </Typography>
            <TextField
              fullWidth
              placeholder="Entrez le nom de votre ferme"
              {...register('farmName')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: 'text.secondary' }} />
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
          </Grid>
        )}
      </Grid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{ 
          mt: 4,
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
        {isLoading ? 'Création du compte...' : 'Créer un compte'}
      </Button>
    </Box>
  )
}

export default RegisterForm