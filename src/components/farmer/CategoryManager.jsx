// components/farmer/CategoryManager.jsx
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add, Clear } from '@mui/icons-material';
import ApiService from '../../services/apiService';

const CategoryManager = ({ onCategoryCreated, buttonText = "Nouvelle Catégorie", buttonVariant = "outlined", buttonSize = "small" }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categoryData, setCategoryData] = useState({
    name: '',
    slug: '',
    parent: null
  });
  const [parentCategories, setParentCategories] = useState([]);
  const [loadingParents, setLoadingParents] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    setError('');
    setSuccess('');
    setCategoryData({ name: '', slug: '', parent: null });
    
    // Charger les catégories parentes
    try {
      setLoadingParents(true);
      const categories = await ApiService.getCategories();
      setParentCategories(categories || []);
    } catch (err) {
      console.error('Error loading parent categories:', err);
    } finally {
      setLoadingParents(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      // Générer automatiquement le slug à partir du nom
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Retirer les caractères spéciaux
        .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
        .replace(/-+/g, '-'); // Éviter les tirets multiples
      
      setCategoryData({
        ...categoryData,
        name: value,
        slug: slug
      });
    } else {
      setCategoryData({
        ...categoryData,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!categoryData.name.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    if (!categoryData.slug.trim()) {
      setError('Le slug est requis');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dataToSend = {
        name: categoryData.name.trim(),
        slug: categoryData.slug.trim(),
        parent: categoryData.parent || null
      };

      await ApiService.createCategory(dataToSend);
      
      setSuccess('Catégorie créée avec succès!');
      
      // Notifier le parent
      if (onCategoryCreated) {
        setTimeout(() => {
          onCategoryCreated();
          handleClose();
        }, 1500);
      } else {
        setTimeout(handleClose, 1500);
      }
      
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err.message || 'Erreur lors de la création de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={buttonVariant}
        startIcon={<Add />}
        onClick={handleOpen}
        size={buttonSize}
      >
        {buttonText}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Créer une nouvelle catégorie
            <IconButton onClick={handleClose} size="small" disabled={loading}>
              <Clear />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              autoFocus
              label="Nom de la catégorie *"
              name="name"
              value={categoryData.name}
              onChange={handleInputChange}
              placeholder="Ex: Fruits, Légumes, Viandes..."
              fullWidth
              disabled={loading}
            />
            
            <TextField
              label="Slug *"
              name="slug"
              value={categoryData.slug}
              onChange={handleInputChange}
              placeholder="Ex: fruits, legumes, viandes"
              fullWidth
              disabled={loading}
              helperText="Identifiant unique pour les URLs (généré automatiquement)"
            />
            
            <FormControl fullWidth disabled={loading || loadingParents}>
              <InputLabel>Catégorie parente (optionnel)</InputLabel>
              <Select
                name="parent"
                value={categoryData.parent || ''}
                onChange={handleInputChange}
                label="Catégorie parente (optionnel)"
              >
                <MenuItem value="">
                  <em>Aucune (catégorie principale)</em>
                </MenuItem>
                {loadingParents ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Chargement...
                  </MenuItem>
                ) : parentCategories.length === 0 ? (
                  <MenuItem disabled>Aucune catégorie disponible</MenuItem>
                ) : (
                  parentCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            
            <Typography variant="caption" color="text.secondary">
              * Champ obligatoire
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            variant="outlined"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !categoryData.name.trim() || !categoryData.slug.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Création...' : 'Créer la catégorie'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryManager;