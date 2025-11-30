// components/Farmer/ProductForm.js
import React, { useState, useRef } from 'react'
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
  Chip,
  CircularProgress
} from '@mui/material'
import {
  AddPhotoAlternate,
  Delete,
  Image
} from '@mui/icons-material'
import { PRODUCT_CATEGORIES } from '../../utils/Constants'

const productSchema = yup.object({
  name: yup.string().required('Le nom du produit est requis'),
  category_id: yup.number().required('La catégorie est requise'),
  price: yup
    .number()
    .typeError('Le prix doit être un nombre')
    .positive('Le prix doit être positif')
    .required('Le prix est requis'),
  stock: yup
    .number()
    .typeError('La quantité doit être un nombre')
    .positive('La quantité doit être positive')
    .integer('La quantité doit être un nombre entier')
    .required('La quantité est requise'),
  unit: yup.string().required('L\'unité est requise'),
  description: yup.string().required('La description est requise')
})

const ProductForm = ({ onSubmit, initialData, onCancel, loading }) => {
  const [mediaFiles, setMediaFiles] = useState([])
  const [mediaError, setMediaError] = useState('')
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: initialData || {
      unit: 'kg',
      available: true
    }
  })

  // Initialiser les valeurs si modification
  React.useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key, initialData[key])
      })
    }
  }, [initialData, setValue])

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files)
    
    // Vérifier le nombre total de médias
    if (files.length + mediaFiles.length > 10) {
      setMediaError('Maximum 10 images autorisées')
      return
    }

    // Vérifier la taille des fichiers
    const maxSize = 5 * 1024 * 1024 // 5MB pour images
    const oversizedFiles = files.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      setMediaError('Fichier(s) trop volumineux. Maximum: 5MB par fichier')
      return
    }

    const newMedia = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
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
    if (mediaFiles.length === 0 && !initialData?.images?.length) {
      setMediaError('Au moins une photo est requise')
      return
    }

    const formData = new FormData()
    
    // Ajouter les données du formulaire
    Object.keys(data).forEach(key => {
      if (key !== 'images') {
        formData.append(key, data[key])
      }
    })

    // Ajouter les nouvelles images
    mediaFiles.forEach(media => {
      formData.append('images', media.file)
    })

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
            <FormControl fullWidth error={!!errors.category_id}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                {...register('category_id')}
                label="Catégorie"
              >
                {/* Les catégories seront chargées depuis l'API */}
                <MenuItem value={1}>Légumes</MenuItem>
                <MenuItem value={2}>Fruits</MenuItem>
                <MenuItem value={3}>Céréales</MenuItem>
                <MenuItem value={4}>Tubercules</MenuItem>
                <MenuItem value={5}>Épices</MenuItem>
                <MenuItem value={6}>Légumineuses</MenuItem>
                <MenuItem value={7}>Produits animaux</MenuItem>
              </Select>
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
              placeholder="Décrivez votre produit en détail : qualité, fraîcheur, méthode de culture, etc."
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

            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Image />}
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
            </Box>

            <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
              📸 Maximum 10 images • 📷 Taille max: 5MB par image
            </Typography>

            {/* Images existantes (pour la modification) */}
            {initialData?.images && initialData.images.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Images actuelles:
                </Typography>
                <Grid container spacing={2}>
                  {initialData.images.map((image, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={image.image}
                          alt={`Produit ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: 8
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Aperçu des nouvelles images */}
            {mediaFiles.length > 0 && (
              <Grid container spacing={2}>
                {mediaFiles.map((media, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Box 
                      sx={{ 
                        position: 'relative',
                        border: '2px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'hidden',
                        '&:hover': {
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      <img
                        src={media.preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            backgroundColor: 'error.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'error.dark'
                            }
                          }}
                          onClick={() => removeMedia(index)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          px: 1,
                          py: 0.5
                        }}
                      >
                        <Typography variant="caption" noWrap>
                          {media.name}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {getFileSize(media.size)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Statistiques des médias */}
            {(mediaFiles.length > 0 || initialData?.images?.length > 0) && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2">
                  📊 {mediaFiles.length} nouvelle(s) image(s) sélectionnée(s) • 
                  📷 {initialData?.images?.length || 0} image(s) existante(s)
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || (mediaFiles.length === 0 && !initialData)}
            startIcon={loading ? <CircularProgress size={20} /> : <AddPhotoAlternate />}
          >
            {loading ? 'Enregistrement...' : initialData ? 'Modifier le Produit' : 'Publier le Produit'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default ProductForm