// components/Farmer/ProductForm.js - Version corrigée
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
  Chip
} from '@mui/material'
import {
  AddPhotoAlternate,
  Delete,
  Image,
  Category
} from '@mui/icons-material'
import ApiService from '../../services/apiService'

// Schéma de validation
const productSchema = yup.object({
  name: yup.string().required('Le nom du produit est requis'),
  category_id: yup.number()
    .required('La catégorie est requise')
    .typeError('Veuillez sélectionner une catégorie'),
  price: yup.number()
    .positive('Le prix doit être positif')
    .required('Le prix est requis')
    .typeError('Le prix doit être un nombre'),
  stock: yup.number()
    .positive('La quantité doit être positive')
    .integer('La quantité doit être un nombre entier')
    .required('La quantité est requise')
    .typeError('La quantité doit être un nombre'),
  unit: yup.string().required('L\'unité est requise'),
  description: yup.string().required('La description est requise'),
})

const ProductForm = ({ onSubmit, initialData, onCancel, loading }) => {
  const [mediaFiles, setMediaFiles] = useState([])
  const [mediaError, setMediaError] = useState('')
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: initialData || {
      unit: 'kg',
      available: true,
      price: '',
      stock: '',
      category_id: ''
    }
  })

  // Observer la catégorie sélectionnée
  const categoryId = watch('category_id')

  // Charger les catégories de manière hiérarchique
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        const categoriesData = await ApiService.getCategories()
        
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData)
        } else {
          // Si l'API retourne un format différent
          setCategories([])
          console.error('Format de catégories non supporté:', categoriesData)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        // Catégories par défaut en cas d'erreur
        setCategories([
          { 
            id: 1, 
            name: 'Fruits',
            subcategories: [
              { id: 2, name: 'Agrumes' },
              { id: 3, name: 'Fruits Rouges' },
              { id: 4, name: 'Fruits Exotiques' }
            ]
          },
          { 
            id: 5, 
            name: 'Légumes',
            subcategories: [
              { id: 6, name: 'Légumes Racines' },
              { id: 7, name: 'Légumes Feuilles' },
              { id: 8, name: 'Légumes Fruits' }
            ]
          }
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
      console.log('Initial data in form:', initialData)
      
      Object.keys(initialData).forEach(key => {
        if (key === 'category' && initialData.category) {
          setValue('category_id', initialData.category.id)
          setSelectedCategory(initialData.category)
        } else if (key === 'images' && Array.isArray(initialData.images)) {
          // Gérer les images existantes si modification
          const existingImages = initialData.images.map(img => ({
            preview: img.image,
            name: `image-${img.id}.jpg`,
            isExisting: true
          }))
          setMediaFiles(existingImages)
        } else {
          setValue(key, initialData[key])
        }
      })
    }
  }, [initialData, setValue])

  // Mettre à jour la catégorie sélectionnée
  useEffect(() => {
    if (categoryId) {
      const findCategory = (cats, id) => {
        for (const cat of cats) {
          if (cat.id === parseInt(id)) {
            return cat
          }
          if (cat.subcategories && Array.isArray(cat.subcategories)) {
            const found = findCategory(cat.subcategories, id)
            if (found) return found
          }
        }
        return null
      }
      setSelectedCategory(findCategory(categories, categoryId))
    } else {
      setSelectedCategory(null)
    }
  }, [categoryId, categories])

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files)
    
    if (files.length + mediaFiles.length > 10) {
      setMediaError('Maximum 10 images autorisées')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      setMediaError('Fichier(s) trop volumineux. Maximum: 5MB par fichier')
      return
    }

    const newMedia = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      isExisting: false
    }))

    setMediaFiles(prev => [...prev, ...newMedia])
    setMediaError('')
  }

  const removeMedia = (index) => {
    const media = mediaFiles[index]
    if (media.preview && !media.isExisting) {
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

    // Créer un FormData
    const formData = new FormData()
    
    // Ajouter les données de base
    formData.append('name', data.name)
    formData.append('category_id', data.category_id)
    formData.append('price', data.price.toString())
    formData.append('stock', data.stock.toString())
    formData.append('unit', data.unit)
    formData.append('description', data.description)
    formData.append('available', 'true')

    // Ajouter les nouvelles images seulement
    mediaFiles.forEach(media => {
      if (!media.isExisting && media.file) {
        formData.append('images', media.file)
      }
    })

    console.log('FormData prêt pour envoi:')
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
      
      // Afficher l'erreur spécifique
      let errorMessage = 'Une erreur est survenue'
      if (error.message) {
        errorMessage = error.message
      } else if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          const errorData = error.response.data
          const messages = []
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              messages.push(...errorData[key])
            } else {
              messages.push(errorData[key])
            }
          })
          errorMessage = messages.join(', ')
        } else {
          errorMessage = error.response.data
        }
      }
      
      setMediaError(errorMessage)
      throw error
    }
  }

  // Fonction pour afficher les catégories de manière récursive
  const renderCategoryOptions = (categories, depth = 0) => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return null
    }

    return categories.map(category => (
      <React.Fragment key={category.id}>
        <MenuItem value={category.id} sx={{ pl: depth * 3 }}>
          {depth > 0 ? '— '.repeat(depth) : ''}{category.name}
        </MenuItem>
        {category.subcategories && category.subcategories.length > 0 && 
          renderCategoryOptions(category.subcategories, depth + 1)
        }
      </React.Fragment>
    ))
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {initialData ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
      </Typography>

      {mediaError && !errors.category_id && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {mediaError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom du Produit"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.category_id}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                {...register('category_id')}
                label="Catégorie"
                defaultValue=""
                disabled={categoriesLoading || loading}
              >
                <MenuItem value="">
                  <em>Sélectionnez une catégorie</em>
                </MenuItem>
                {categoriesLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Chargement des catégories...
                  </MenuItem>
                ) : (
                  renderCategoryOptions(categories)
                )}
              </Select>
              {selectedCategory && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Catégorie: {selectedCategory.name}
                    {selectedCategory.parent && ` (Sous-catégorie)`}
                  </Typography>
                </Box>
              )}
              {errors.category_id && (
                <Typography variant="caption" color="error">
                  {errors.category_id.message}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Prix (FCFA)"
              type="number"
              inputProps={{ 
                step: "0.01", 
                min: "0",
                placeholder: "0.00"
              }}
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Quantité en stock"
              type="number"
              inputProps={{ 
                min: "0",
                placeholder: "0"
              }}
              {...register('stock')}
              error={!!errors.stock}
              helperText={errors.stock?.message}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth error={!!errors.unit}>
              <InputLabel>Unité</InputLabel>
              <Select
                {...register('unit')}
                label="Unité"
                defaultValue="kg"
                disabled={loading}
              >
                <MenuItem value="kg">Kilogramme (kg)</MenuItem>
                <MenuItem value="piece">Pièce</MenuItem>
                <MenuItem value="sac">Sac</MenuItem>
                <MenuItem value="litre">Litre (L)</MenuItem>
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
              placeholder="Décrivez votre produit en détail..."
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Photos du Produit
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ajoutez au moins une photo de votre produit. Maximum 10 photos, 5MB par photo.
              </Typography>

              <Button
                variant="outlined"
                component="label"
                startIcon={<Image />}
                sx={{ mb: 2 }}
                disabled={mediaFiles.length >= 10 || loading}
              >
                {mediaFiles.length === 0 ? 'Ajouter des Photos' : 'Ajouter Plus de Photos'}
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
                            borderRadius: 8,
                            border: '1px solid #e0e0e0'
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'error.main'
                            }
                          }}
                          onClick={() => removeMedia(index)}
                          disabled={loading}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                        {media.isExisting && (
                          <Chip
                            label="Existante"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              left: 4,
                              backgroundColor: 'primary.main',
                              color: 'white',
                              fontSize: '0.7rem'
                            }}
                          />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={onCancel} 
            disabled={loading}
          >
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