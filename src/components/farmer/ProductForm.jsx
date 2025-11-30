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
  Chip
} from '@mui/material'
import {
  AddPhotoAlternate,
  Delete,
  Videocam,
  Image
} from '@mui/icons-material'
import { PRODUCT_CATEGORIES } from '../../utils/Constants'

const productSchema = yup.object({
  name: yup.string().required('Le nom du produit est requis'),
  category: yup.string().required('La catégorie est requise'),
  price: yup
    .number()
    .typeError('Le prix doit être un nombre')
    .positive('Le prix doit être positif')
    .required('Le prix est requis'),
  quantity: yup
    .number()
    .typeError('La quantité doit être un nombre')
    .positive('La quantité doit être positive')
    .integer('La quantité doit être un nombre entier')
    .required('La quantité est requise'),
  unit: yup.string().required('L\'unité est requise'),
  description: yup.string().required('La description est requise')
})

const ProductForm = ({ onSubmit, initialData, onCancel, loading }) => {
  const [mediaFiles, setMediaFiles] = useState(initialData?.media || [])
  const [mediaError, setMediaError] = useState('')
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: initialData || {
      unit: 'kg'
    }
  })

  const handleMediaUpload = (event, type) => {
    const files = Array.from(event.target.files)
    
    // Vérifier le nombre total de médias
    if (files.length + mediaFiles.length > 10) {
      setMediaError('Maximum 10 médias autorisés (photos + vidéos)')
      return
    }

    // Vérifier la taille des fichiers
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024 // 50MB pour vidéos, 5MB pour images
    const oversizedFiles = files.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      setMediaError(`Fichier(s) trop volumineux. Maximum: ${type === 'video' ? '50MB' : '5MB'} par fichier`)
      return
    }

    const newMedia = files.map(file => ({
      file,
      type,
      preview: type === 'image' ? URL.createObjectURL(file) : null,
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

  const handleFormSubmit = (data) => {
    if (mediaFiles.length === 0) {
      setMediaError('Au moins une photo ou vidéo est requise')
      return
    }

    const formData = new FormData()
    
    // Ajouter les données du formulaire
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })

    // Ajouter les médias
    mediaFiles.forEach(media => {
      formData.append('media', media.file)
      formData.append('media_types', media.type)
    })

    onSubmit(formData)
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
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                {...register('category')}
                label="Catégorie"
              >
                {PRODUCT_CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
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
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Quantité"
              type="number"
              {...register('quantity')}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
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
                <MenuItem value="g">Gramme</MenuItem>
                <MenuItem value="l">Litre</MenuItem>
                <MenuItem value="pièce">Pièce</MenuItem>
                <MenuItem value="sachet">Sachet</MenuItem>
                <MenuItem value="botte">Botte</MenuItem>
                <MenuItem value="carton">Carton</MenuItem>
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
              Photos et Vidéos du Produit
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
                  onChange={(e) => handleMediaUpload(e, 'image')}
                  ref={fileInputRef}
                />
              </Button>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<Videocam />}
              >
                Ajouter une Vidéo
                <input
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={(e) => handleMediaUpload(e, 'video')}
                  ref={videoInputRef}
                />
              </Button>
            </Box>

            <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
              📸 Maximum 10 médias (photos + vidéos) • 📷 Photos: max 5MB • 🎥 Vidéos: max 50MB
            </Typography>

            {/* Aperçu des médias */}
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
                      {media.type === 'image' ? (
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
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '120px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'grey.100',
                            flexDirection: 'column',
                            gap: 1
                          }}
                        >
                          <Videocam sx={{ fontSize: 40, color: 'text.secondary' }} />
                          <Typography variant="caption" textAlign="center" px={1}>
                            {media.name}
                          </Typography>
                        </Box>
                      )}
                      
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          display: 'flex',
                          gap: 0.5
                        }}
                      >
                        <Chip
                          label={media.type === 'image' ? '📷 Photo' : '🎥 Vidéo'}
                          size="small"
                          color={media.type === 'image' ? 'primary' : 'secondary'}
                        />
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
            {mediaFiles.length > 0 && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2">
                  📊 {mediaFiles.length} média(s) sélectionné(s) • 
                  📷 {mediaFiles.filter(m => m.type === 'image').length} photo(s) • 
                  🎥 {mediaFiles.filter(m => m.type === 'video').length} vidéo(s)
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
            disabled={loading || mediaFiles.length === 0}
            startIcon={<AddPhotoAlternate />}
          >
            {loading ? 'Enregistrement...' : initialData ? 'Modifier le Produit' : 'Publier le Produit'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default ProductForm