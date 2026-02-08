// components/farmer/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Clear,
  CloudUpload
} from '@mui/icons-material';
import ApiService from '../../services/apiService';
import CategoryManager from './CategoryManager';

const ProductForm = ({ onSubmit, initialData = null, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    stock: '',
    category_id: '',
    available: true,
    image: null
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // Initialiser le formulaire avec les données existantes si en mode édition
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        unit: initialData.unit || '',
        stock: initialData.stock || '',
        category_id: initialData.category_id || '',
        available: initialData.available !== undefined ? initialData.available : true,
        image: null
      });
      
      if (initialData.image_url) {
        setImagePreview(initialData.image_url);
      }
    }
  }, [initialData]);

  // Charger les catégories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await ApiService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérification du type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF.');
      return;
    }

    // Vérification de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('L\'image est trop volumineuse (max 5MB).');
      return;
    }

    setImageError('');
    setFormData({
      ...formData,
      image: file
    });

    // Créer une preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Le nom du produit est requis');
      }
      if (!formData.description.trim()) {
        throw new Error('La description est requise');
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error('Le prix doit être supérieur à 0');
      }
      if (!formData.unit.trim()) {
        throw new Error('L\'unité est requise');
      }
      if (!formData.stock || parseInt(formData.stock) < 0) {
        throw new Error('Le stock doit être un nombre positif');
      }
      if (!formData.category_id) {
        throw new Error('Veuillez sélectionner une catégorie');
      }

      // Préparer les données pour l'envoi
      const formDataToSend = new FormData();
      
      // Ajouter les champs textuels
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('unit', formData.unit.trim());
      formDataToSend.append('stock', parseInt(formData.stock));
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('available', formData.available);
      
      // Ajouter l'image si elle existe (nouvelle ou modifiée)
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      } else if (initialData?.image_url && !imagePreview?.startsWith('data:')) {
        // Si on garde l'image existante
        formDataToSend.append('keep_existing_image', 'true');
      }

      // Appeler la fonction onSubmit du parent
      await onSubmit(formDataToSend);
      
    } catch (error) {
      console.error('Erreur validation:', error);
      alert(error.message);
    } finally {
      setLocalLoading(false);
    }
  };

  const clearImage = () => {
    setFormData({
      ...formData,
      image: null
    });
    setImagePreview(null);
    setImageError('');
  };

  const handleCategoryCreated = async () => {
    await loadCategories();
    // Optionnel: sélectionner automatiquement la nouvelle catégorie
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        {initialData ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12}>
            <TextField
              label="Nom du produit *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading || localLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description *"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
              required
              disabled={loading || localLoading}
            />
          </Grid>

          {/* Prix, Unité et Stock */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Prix *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading || localLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">FCFA</InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Unité *"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading || localLoading}
              placeholder="Ex: kg, pièce, litre..."
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Stock disponible *"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading || localLoading}
            />
          </Grid>

          {/* Catégorie */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <FormControl fullWidth required disabled={loading || localLoading}>
                <InputLabel>Catégorie *</InputLabel>
                <Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  label="Catégorie *"
                >
                  <MenuItem value="">
                    <em>Sélectionner une catégorie</em>
                  </MenuItem>
                  {categoriesLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Chargement des catégories...
                    </MenuItem>
                  ) : categories.length === 0 ? (
                    <MenuItem disabled>
                      Aucune catégorie disponible
                    </MenuItem>
                  ) : (
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                        {category.parent_name && (
                          <Typography 
                            component="span" 
                            variant="caption" 
                            sx={{ ml: 1, color: 'text.secondary' }}
                          >
                            ({category.parent_name})
                          </Typography>
                        )}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              
              <CategoryManager 
                onCategoryCreated={handleCategoryCreated}
                buttonText="Nouvelle"
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              * Champ obligatoire
            </Typography>
          </Grid>

          {/* Upload d'image */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Image du produit
            </Typography>
            
            {imageError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {imageError}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              {/* Zone d'upload */}
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  flex: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'action.hover'
                  }
                }}
                onClick={() => document.getElementById('product-image-upload').click()}
              >
                <input
                  id="product-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  disabled={loading || localLoading}
                />
                
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="body1">
                  Cliquez pour télécharger une image
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  JPG, PNG ou GIF (max 5MB)
                </Typography>
              </Box>

              {/* Preview de l'image */}
              {imagePreview && (
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: 150,
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={clearImage}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'white',
                      boxShadow: 1,
                      '&:hover': { backgroundColor: 'grey.100' }
                    }}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
            
            {initialData?.image_url && !imagePreview && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Image actuelle:
                </Typography>
                <img
                  src={initialData.image_url}
                  alt="Produit actuel"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginTop: 8
                  }}
                />
              </Box>
            )}
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading || localLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || localLoading || categoriesLoading}
                startIcon={localLoading ? <CircularProgress size={20} /> : <Add />}
              >
                {localLoading ? 'Envoi en cours...' : initialData ? 'Mettre à jour' : 'Créer le produit'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm;