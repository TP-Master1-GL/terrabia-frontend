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
  DialogActions
} from '@mui/material'
import {
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material'

const ProductList = ({ products, onEdit, onDelete, loading }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleDeleteClick = (product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      onDelete(selectedProduct.id)
      setDeleteDialogOpen(false)
      setSelectedProduct(null)
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
    return colors[category] || 'default'
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
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.images?.[0] || '/placeholder-product.jpg'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h3" noWrap>
                    {product.name}
                  </Typography>
                  <Chip 
                    label={product.category} 
                    size="small" 
                    color={getCategoryColor(product.category)}
                  />
                </Box>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...` 
                    : product.description
                  }
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    {product.price} FCFA
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.quantity} {product.unit}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={product.is_available ? 'Disponible' : 'Indisponible'} 
                    color={product.is_available ? 'success' : 'default'}
                    size="small"
                  />
                  
                  <Box>
                    <IconButton size="small" onClick={() => onEdit(product)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(product)}>
                      <Delete />
                    </IconButton>
                  </Box>
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
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ProductList