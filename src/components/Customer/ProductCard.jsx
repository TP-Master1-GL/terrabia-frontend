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
  Fab
} from '@mui/material'
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Visibility,
  PlayArrow,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

const ProductCard = ({ product, onAddToCart, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(product.is_favorite || false)
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const { user } = useAuth()

  const media = product.media || product.images || []

  const handleFavoriteClick = () => {
    if (!user) {
      // Rediriger vers login
      return
    }
    setIsFavorite(!isFavorite)
    onToggleFavorite?.(product.id, !isFavorite)
  }

  const handleAddToCart = () => {
    if (!user) {
      // Rediriger vers login
      return
    }
    onAddToCart?.(product.id, 1)
  }

  const handleMediaClick = (index) => {
    setSelectedMediaIndex(index)
    setMediaDialogOpen(true)
  }

  const nextMedia = () => {
    setSelectedMediaIndex((prev) => (prev + 1) % media.length)
  }

  const prevMedia = () => {
    setSelectedMediaIndex((prev) => (prev - 1 + media.length) % media.length)
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
    return colors[category] || 'default'
  }

  const getMediaType = (mediaItem) => {
    if (typeof mediaItem === 'string') {
      return mediaItem.includes('/video/') || mediaItem.endsWith('.mp4') || mediaItem.endsWith('.mov') ? 'video' : 'image'
    }
    return mediaItem.type || 'image'
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
          {media.length > 0 ? (
            <>
              {getMediaType(media[0]) === 'image' ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={typeof media[0] === 'string' ? media[0] : media[0].preview || media[0].url}
                  alt={product.name}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleMediaClick(0)}
                />
              ) : (
                <Box sx={{ position: 'relative', height: 200, backgroundColor: 'grey.900' }}>
                  <video
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleMediaClick(0)}
                  >
                    <source src={typeof media[0] === 'string' ? media[0] : media[0].preview || media[0].url} type="video/mp4" />
                  </video>
                  <Fab
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    <PlayArrow />
                  </Fab>
                </Box>
              )}
            </>
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
            {media.length > 1 && (
              <Fab size="small" color="secondary">
                <Typography variant="caption" fontWeight="bold">
                  +{media.length - 1}
                </Typography>
              </Fab>
            )}
          </Box>
          
          <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
            <Chip 
              label={product.category} 
              size="small" 
              color={getCategoryColor(product.category)}
            />
          </Box>
          
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton 
              size="small" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
              onClick={handleFavoriteClick}
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {product.name}
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flexGrow: 1 }}>
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description
            }
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.rating || 0} readOnly size="small" />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
              ({product.review_count || 0})
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Par {product.farmer?.name}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {product.price} FCFA
            </Typography>
            <Typography variant="body2" color="textSecondary">
              / {product.unit}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={product.quantity > 0 ? `${product.quantity} disponible` : 'Rupture'} 
              color={product.quantity > 0 ? 'success' : 'error'}
              size="small"
            />
            
            <Button
              variant="contained"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              size="small"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: '600'
              }}
            >
              Panier
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog pour afficher les médias */}
      <Dialog 
        open={mediaDialogOpen} 
        onClose={() => setMediaDialogOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'black'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', minHeight: 400 }}>
          {media.length > 0 && (
            <>
              {getMediaType(media[selectedMediaIndex]) === 'image' ? (
                <img
                  src={typeof media[selectedMediaIndex] === 'string' ? media[selectedMediaIndex] : media[selectedMediaIndex].preview || media[selectedMediaIndex].url}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '70vh',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <video
                  controls
                  autoPlay
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '70vh'
                  }}
                >
                  <source src={typeof media[selectedMediaIndex] === 'string' ? media[selectedMediaIndex] : media[selectedMediaIndex].preview || media[selectedMediaIndex].url} type="video/mp4" />
                </video>
              )}
              
              {/* Navigation */}
              {media.length > 1 && (
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
        {media.length > 1 && (
          <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto', backgroundColor: 'grey.900' }}>
            {media.map((mediaItem, index) => (
              <Box
                key={index}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: selectedMediaIndex === index ? '2px solid white' : '1px solid grey',
                  opacity: selectedMediaIndex === index ? 1 : 0.7,
                  flexShrink: 0
                }}
                onClick={() => setSelectedMediaIndex(index)}
              >
                {getMediaType(mediaItem) === 'image' ? (
                  <img
                    src={typeof mediaItem === 'string' ? mediaItem : mediaItem.preview || mediaItem.url}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'grey.800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <PlayArrow sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
        
        <DialogActions sx={{ backgroundColor: 'grey.900' }}>
          <Button onClick={() => setMediaDialogOpen(false)} sx={{ color: 'white' }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ProductCard