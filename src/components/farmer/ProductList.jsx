// components/Farmer/ProductList.js
import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material'

const ProductList = ({ products, onEdit, onDelete, loading, error }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleDeleteClick = (product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      setDeleteLoading(true)
      try {
        await onDelete(selectedProduct.id)
        setDeleteDialogOpen(false)
        setSelectedProduct(null)
      } catch (error) {
        console.error('Error deleting product:', error)
      } finally {
        setDeleteLoading(false)
      }
    }
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

  const getStatusColor = (available) => {
    return available ? 'success' : 'error'
  }

  const getStatusText = (available) => {
    return available ? 'Disponible' : 'Indisponible'
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    )
  }

  if (products.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color="textSecondary">
          Aucun produit trouvé
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Commencez par ajouter votre premier produit
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.images?.[0]?.image || '/placeholder-product.jpg'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h3" noWrap sx={{ flex: 1 }}>
                    {product.name}
                  </Typography>
                  <Chip 
                    label={product.category?.name} 
                    size="small" 
                    color={getCategoryColor(product.category)}
                  />
                </Box>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40 }}>
                  {product.description && product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...` 
                    : product.description || 'Aucune description'
                  }
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    {parseFloat(product.price).toLocaleString()} FCFA
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.stock} {product.unit}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={getStatusText(product.available)} 
                    color={getStatusColor(product.available)}
                    size="small"
                  />
                  
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => onEdit(product)}
                      disabled={loading}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteClick(product)}
                      disabled={loading}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Créé le: {new Date(product.created_at).toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le produit "{selectedProduct?.name}" ? 
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={16} /> : null}
          >
            {deleteLoading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ProductList