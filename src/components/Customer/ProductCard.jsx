// components/Customer/ProductCard.js
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Rating,
  Dialog,
  DialogContent,
  DialogActions,
  Fab,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Visibility,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import apiService from '../../services/apiService'

const ProductCard = ({ product, onAddToCart, onToggleFavorite }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(product.is_favorite || false)
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const images = product.images || []

  const handleFavoriteClick = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      await apiService.toggleFavorite(product.id)
      setIsFavorite(!isFavorite)
      onToggleFavorite?.(product.id, !isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
      setError('Erreur lors de la modification des favoris')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      await apiService.addToCart(product.id, 1)
      onAddToCart?.(product.id, 1)
      // Vous pouvez ajouter une notification de succès ici
    } catch (error) {
      console.error('Error adding to cart:', error)
      setError('Erreur lors de l\'ajout au panier')
    } finally {
      setLoading(false)
    }
  }

  const handleMediaClick = (index) => {
    setSelectedMediaIndex(index)
    setMediaDialogOpen(true)
  }

  const nextMedia = () => {
    setSelectedMediaIndex((prev) => (prev + 1) % images.length)
  }

  const prevMedia = () => {
    setSelectedMediaIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Légumes': 'success',
      'Fruits': 'warning',
      'Céréales': 'primary',
      'Tubercules': 'secondary',
      'Épices': 'error',
      'Légumineuses': 'info',
      'Produits animaux': 'default'
    }
    return colors[category?.name] || 'default'
  }

  return (
    <>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        transition: 'all 0.3s ease', 
        '&:hover': { 
          transform: 'translateY(-8px)', 
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          '& .media-overlay': {
            opacity: 1
          }
        } 
      }}>
        <Box sx={{ position: 'relative' }}>
          {images.length > 0 ? (
            <CardMedia
              component="img"
              height="200"
              image={images[0]?.image || '/placeholder-product.jpg'}
              alt={product.name}
              sx={{ objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => handleMediaClick(0)}
            />
          ) : (
            <CardMedia
              component="img"
              height="200"
              image="/placeholder-product.jpg"
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          )}
          
          {/* Overlay avec actions */}
          <Box 
            className="media-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              gap: 1
            }}
          >
            <Fab size="small" color="primary" onClick={() => handleMediaClick(0)}>
              <Visibility />
            </Fab>
            {images.length > 1 && (
              <Fab size="small" color="secondary">
                <Typography variant="caption" fontWeight="bold">
                  +{images.length - 1}
                </Typography>
              </Fab>
            )}
          </Box>
          
          <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
            <Chip 
              label={product.category?.name} 
              size="small" 
              color={getCategoryColor(product.category)}
            />
          </Box>
          
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton 
              size="small" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
              onClick={handleFavoriteClick}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : (isFavorite ? <Favorite color="error" /> : <FavoriteBorder />)}
            </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {product.name}
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flexGrow: 1 }}>
            {product.description && product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description || 'Aucune description'
            }
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.rating || 0} readOnly size="small" />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
              ({product.review_count || 0})
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Par {product.farmer?.first_name} {product.farmer?.last_name}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {parseFloat(product.price).toLocaleString()} FCFA
            </Typography>
            <Typography variant="body2" color="textSecondary">
              / {product.unit}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={product.available && product.stock > 0 ? `${product.stock} disponible` : 'Rupture'} 
              color={product.available && product.stock > 0 ? 'success' : 'error'}
              size="small"
            />
            
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} /> : <AddShoppingCart />}
              onClick={handleAddToCart}
              disabled={!product.available || product.stock === 0 || loading}
              size="small"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: '600'
              }}
            >
              {loading ? '' : 'Panier'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}

      {/* Dialog pour afficher les images */}
      <Dialog 
        open={mediaDialogOpen} 
        onClose={() => setMediaDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative', minHeight: 400 }}>
          {images.length > 0 && (
            <>
              <img
                src={images[selectedMediaIndex]?.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
              />
              
              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <IconButton
                    onClick={prevMedia}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    <NavigateBefore />
                  </IconButton>
                  <IconButton
                    onClick={nextMedia}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    <NavigateNext />
                  </IconButton>
                </>
              )}
            </>
          )}
        </DialogContent>
        
        {/* Miniatures */}
        {images.length > 1 && (
          <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: selectedMediaIndex === index ? '2px solid primary.main' : '1px solid grey',
                  opacity: selectedMediaIndex === index ? 1 : 0.7,
                  flexShrink: 0
                }}
                onClick={() => setSelectedMediaIndex(index)}
              >
                <img
                  src={image.image}
                  alt={`${product.name} ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
        
        <DialogActions>
          <Button onClick={() => setMediaDialogOpen(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ProductCard