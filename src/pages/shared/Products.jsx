// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Slider,
  Drawer,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Rating,
  Tooltip,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';
import {
  Search,
  GridView,
  ViewList,
  FilterList,
  Clear,
  Tune,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Message,
  LocalShipping,
  Star,
  Visibility,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { PRODUCT_CATEGORIES } from '../../utils/Constants';

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // États
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, sortBy, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        ordering: sortBy,
        price_min: priceRange[0],
        price_max: priceRange[1],
      };

      const data = await apiService.getProducts(params);
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Impossible de charger les produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories(
        PRODUCT_CATEGORIES.map((cat, index) => ({ id: index + 1, name: cat }))
      );
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('name');
    setPriceRange([0, 10000]);
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await apiService.addToCart(productId, quantity);
      alert('Produit ajouté au panier !');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  const handleToggleFavorite = async (productId) => {
    try {
      await apiService.toggleFavorite(productId);
      fetchProducts();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleStartChat = (farmer) => {
    setSelectedFarmer(farmer);
    setChatDialogOpen(true);
  };

  const handleConfirmChat = () => {
    if (selectedFarmer) {
      // Créer une conversation avec l'agriculteur
      navigate(`/chat?farmer=${selectedFarmer.id}`);
      setChatDialogOpen(false);
    }
  };

  const handleViewProductDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Composant de filtres (tiroir mobile)
  const FilterDrawer = () => (
    <Drawer
      anchor="right"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
      PaperProps={{
        sx: { width: 320, p: 3 },
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Filtres
        </Typography>
        <IconButton onClick={() => setFilterDrawerOpen(false)} size="small">
          <Clear />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Catégorie</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Catégorie"
        >
          <MenuItem value="">Toutes les catégories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Trier par</InputLabel>
        <Select value={sortBy} onChange={handleSortChange} label="Trier par">
          <MenuItem value="name">Nom</MenuItem>
          <MenuItem value="price">Prix: Croissant</MenuItem>
          <MenuItem value="-price">Prix: Décroissant</MenuItem>
          <MenuItem value="-created_at">Nouveautés</MenuItem>
          <MenuItem value="-rating">Meilleures notes</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          Fourchette de prix
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={100}
          sx={{ color: 'primary.main' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {priceRange[0]} FCFA
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {priceRange[1]} FCFA
          </Typography>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="outlined"
        color="error"
        startIcon={<Clear />}
        onClick={handleClearFilters}
      >
        Effacer les filtres
      </Button>
    </Drawer>
  );

  // Composant de carte de produit améliorée
  const EnhancedProductCard = ({ product }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {/* Image du produit */}
      <CardMedia
        component="img"
        height="200"
        image={product.image_url || '/placeholder-product.jpg'}
        alt={product.name}
        sx={{
          objectFit: 'cover',
          cursor: 'pointer',
        }}
        onClick={() => handleViewProductDetails(product.id)}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        {/* En-tête avec nom et favori */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
            }}
            onClick={() => handleViewProductDetails(product.id)}
          >
            {product.name}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleToggleFavorite(product.id)}
            color={product.is_favorite ? 'error' : 'default'}
          >
            {product.is_favorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, height: 40, overflow: 'hidden' }}
        >
          {product.description}
        </Typography>

        {/* Agriculteur */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar
            sx={{ width: 30, height: 30, bgcolor: 'primary.light' }}
            src={product.farmer?.avatar}
          >
            {product.farmer?.first_name?.[0]}
          </Avatar>
          <Typography variant="body2">
            {product.farmer?.first_name} {product.farmer?.last_name}
          </Typography>
        </Box>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Rating
            value={product.rating || 4.5}
            precision={0.5}
            size="small"
            readOnly
          />
          <Typography variant="body2" color="text.secondary">
            ({product.review_count || 12})
          </Typography>
        </Box>

        {/* Prix */}
        <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
          {product.price} FCFA
          <Typography component="span" variant="body2" color="text.secondary">
            / {product.unit}
          </Typography>
        </Typography>

        {/* Informations supplémentaires */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            label="Livraison gratuite"
            size="small"
            color="success"
            variant="outlined"
            icon={<LocalShipping />}
          />
          <Chip
            label="En stock"
            size="small"
            color="success"
            variant="outlined"
          />
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => handleAddToCart(product.id)}
              size="small"
            >
              Ajouter
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Tooltip title="Contacter l'agriculteur">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Message />}
                onClick={() => handleStartChat(product.farmer)}
                size="small"
              >
                Contacter
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="text"
              startIcon={<Visibility />}
              onClick={() => handleViewProductDetails(product.id)}
              size="small"
              sx={{ mt: 1 }}
            >
              Voir détails
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}
        >
          Nos Produits
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Découvrez nos produits frais directement des fermes
        </Typography>
      </Box>

      {/* Barre de recherche et actions */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm('')} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'white',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {!isMobile && (
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="grid">
                    <GridView />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewList />
                  </ToggleButton>
                </ToggleButtonGroup>
              )}

              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterDrawerOpen(true)}
              >
                Filtres
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Filtres actifs */}
      {(selectedCategory || searchTerm) && (
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {searchTerm && (
            <Chip
              label={`Recherche: "${searchTerm}"`}
              onDelete={() => setSearchTerm('')}
              color="primary"
              variant="outlined"
            />
          )}
          {selectedCategory && (
            <Chip
              label={`Catégorie: ${categories.find((c) => c.id === selectedCategory)?.name}`}
              onDelete={() => setSelectedCategory('')}
              color="secondary"
              variant="outlined"
            />
          )}
          <Chip
            label="Tout effacer"
            onClick={handleClearFilters}
            color="error"
            variant="outlined"
            deleteIcon={<Clear />}
            onDelete={handleClearFilters}
          />
        </Box>
      )}

      {/* Contenu principal */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Vue Grid */}
          {viewMode === 'grid' && (
            <Grid container spacing={3}>
              <AnimatePresence>
                {products.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <EnhancedProductCard product={product} />
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}

          {/* Message vide */}
          {products.length === 0 && !loading && (
            <Fade in>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Aucun produit trouvé
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Essayez d'ajuster vos critères de recherche
                </Typography>
              </Box>
            </Fade>
          )}
        </>
      )}

      {/* Tiroir de filtres */}
      <FilterDrawer />

      {/* Dialogue de chat */}
      <Dialog
        open={chatDialogOpen}
        onClose={() => setChatDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{ bgcolor: 'primary.light' }}
              src={selectedFarmer?.avatar}
            >
              {selectedFarmer?.first_name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h6">
                Contacter {selectedFarmer?.first_name} {selectedFarmer?.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Agriculteur
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Vous allez démarrer une conversation avec {selectedFarmer?.first_name}. 
            Vous pourrez discuter du produit, poser des questions sur la production, 
            ou négocier les conditions de livraison.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📞 {selectedFarmer?.phone_number || 'Téléphone non disponible'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📧 {selectedFarmer?.email}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatDialogOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmChat}
            startIcon={<Message />}
          >
            Démarrer la conversation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Products;