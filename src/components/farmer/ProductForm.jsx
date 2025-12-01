// components/Farmer/ProductForm.js
import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material'
import {
  AddPhotoAlternate,
  Delete,
  Image
} from '@mui/icons-material'
import { productsAPI } from '../../services/api'

// Schéma de validation simplifié
const productSchema = yup.object({
  name: yup.string().required('Le nom du produit est requis'),
  category: yup.number().required('La catégorie est requise'),
  price: yup.number().positive('Le prix doit être positif').required('Le prix est requis'),
  stock: yup.number().positive('La quantité doit être positive').integer('La quantité doit être un nombre entier').required('La quantité est requise'),
  unit: yup.string().required('L\'unité est requise'),
  description: yup.string().required('La description est requise'),
})

const ProductForm = ({ onSubmit, initialData, onCancel, loading }) => {
  const [mediaFiles, setMediaFiles] = useState([])
  const [mediaError, setMediaError] = useState('')
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: initialData || {
      unit: 'kg',
      available: true,
    }
  })

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await productsAPI.getCategories()
        if (response.data) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        // Catégories par défaut en cas d'erreur
        setCategories([
          { id: 1, name: 'Légumes' },
          { id: 2, name: 'Fruits' },
          { id: 3, name: 'Céréales' },
          { id: 4, name: 'Tubercules' },
          { id: 5, name: 'Épices' },
          { id: 6, name: 'Légumineuses' },
          { id: 7, name: 'Produits animaux' }
        ])
      } finally {
        setCategoriesLoading(false)
      }
    }
    
    loadCategories()
  }, [])

  // Initialiser les valeurs si modification
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        if (key === 'category' && initialData.category) {
          setValue('category', initialData.category.id)
        } else {
          setValue(key, initialData[key])
        }
      })
    }
  }, [initialData, setValue])

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files)
    
    if (files.length + mediaFiles.length > 10) {
      setMediaError('Maximum 10 images autorisées')
      return
    }

    const maxSize = 5 * 1024 * 1024
    const oversizedFiles = files.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      setMediaError('Fichier(s) trop volumineux. Maximum: 5MB par fichier')
      return
    }

    const newMedia = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))

    setMediaFiles(prev => [...prev, ...newMedia])
    setMediaError('')
  }

  const removeMedia = (index) => {
    const media = mediaFiles[index]
    if (media.preview) {
      URL.revokeObjectURL(media.preview)
    }
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleFormSubmit = async (data) => {
    console.log('Données du formulaire:', data)
    
    if (mediaFiles.length === 0 && !initialData?.images?.length) {
      setMediaError('Au moins une photo est requise')
      return
    }

    const formData = new FormData()
    
    // Ajouter les données de base
    formData.append('name', data.name)
    formData.append('category', data.category)
    formData.append('price', data.price)
    formData.append('stock', data.stock)
    formData.append('unit', data.unit)
    formData.append('description', data.description)
    formData.append('available', 'true') // Toujours disponible lors de la création

    // Ajouter les images
    mediaFiles.forEach(media => {
      formData.append('images', media.file)
    })

    console.log('FormData créé:')
    for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
      throw error
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {initialData ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom du Produit"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                {...register('category')}
                label="Catégorie"
                defaultValue=""
              >
                <MenuItem value="">Sélectionnez une catégorie</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Typography variant="caption" color="error">
                  {errors.category.message}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Prix (FCFA)"
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Quantité en stock"
              type="number"
              inputProps={{ min: "0" }}
              {...register('stock')}
              error={!!errors.stock}
              helperText={errors.stock?.message}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth error={!!errors.unit}>
              <InputLabel>Unité</InputLabel>
              <Select
                {...register('unit')}
                label="Unité"
                defaultValue="kg"
              >
                <MenuItem value="kg">Kilogramme</MenuItem>
                <MenuItem value="piece">Pièce</MenuItem>
                <MenuItem value="sac">Sac</MenuItem>
                <MenuItem value="litre">Litre</MenuItem>
                <MenuItem value="botte">Botte</MenuItem>
              </Select>
              {errors.unit && (
                <Typography variant="caption" color="error">
                  {errors.unit.message}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Photos du Produit
            </Typography>
            
            {mediaError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {mediaError}
              </Alert>
            )}

            <Button
              variant="outlined"
              component="label"
              startIcon={<Image />}
              sx={{ mb: 2 }}
            >
              Ajouter des Photos
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleMediaUpload}
                ref={fileInputRef}
              />
            </Button>

            {mediaFiles.length > 0 && (
              <Grid container spacing={2}>
                {mediaFiles.map((media, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={media.preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: 8
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'error.main',
                          color: 'white',
                        }}
                        onClick={() => removeMedia(index)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AddPhotoAlternate />}
          >
            {loading ? 'Enregistrement...' : initialData ? 'Modifier' : 'Publier'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default ProductForm
