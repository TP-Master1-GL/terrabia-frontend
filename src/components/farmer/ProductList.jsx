// components/farmer/ProductList.jsx
import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Edit,
  Delete,
  Inventory,
  Warning
} from '@mui/icons-material';

const ProductList = ({ products, onEdit, onDelete, loading = false }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setDeleting(true);
      await onDelete(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Fonction pour obtenir l'URL de l'image du produit
  const getProductImage = (product) => {
    // Vérifier si le produit a des images
    if (!product.images || product.images.length === 0) {
      // Image par défaut si aucune image
      return 'https://via.placeholder.com/400x300?text=Produit+sans+image';
    }
    
    // Retourner la première image
    return product.images[0].image;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Aucun produit disponible. Cliquez sur "Ajouter un produit" pour commencer.
      </Alert>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}>
              {/* Image du produit - CORRECTION ICI */}
              <CardMedia
                component="img"
                height="200"
                image={getProductImage(product)}  // Utilisation de la fonction corrigée
                alt={product.name}
                sx={{ 
                  objectFit: 'cover',
                  bgcolor: 'grey.100'
                }}
                onError={(e) => {
                  // En cas d'erreur de chargement d'image
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                }}
              />
              
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Nom du produit */}
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    height: 60,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {product.name}
                </Typography>
                
                {/* Statut et prix */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={product.available ? 'Disponible' : 'Indisponible'}
                    size="small"
                    color={product.available ? 'success' : 'error'}
                    variant="outlined"
                  />
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                    {parseFloat(product.price).toLocaleString('fr-FR')} FCFA
                  </Typography>
                </Box>
                
                {/* Description */}
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    height: 60,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {product.description || 'Aucune description'}
                </Typography>
                
                {/* Détails */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Inventory fontSize="small" sx={{ mr: 0.5 }} />
                    Stock: {product.stock} {product.unit}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {product.images?.length || 0} image(s)
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => onEdit(product)}
                  sx={{ flex: 1 }}
                >
                  Modifier
                </Button>
                
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleDeleteClick(product)}
                  sx={{ flex: 1 }}
                >
                  Supprimer
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" />
            Confirmer la suppression
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.name}" ?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            disabled={deleting}
            variant="outlined"
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <Delete />}
          >
            {deleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductList;