// pages/Products.jsx - CORRIGÉ
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
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
  Pagination
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
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  const [favoritesLoading, setFavoritesLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fonction pour obtenir l'URL de l'image
  const getProductImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return '/placeholder-product.jpg';
    }
    // Retourne la première image
    return product.images[0].image;
  };

  // Fonction pour obtenir le nom de la catégorie
  const getCategoryName = (product) => {
    return product.category?.name || 'Sans catégorie';
  };

  // Charger les catégories au montage
  useEffect(() => {
    fetchCategories();
  }, []);

  // Charger les produits quand les filtres changent
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, sortBy, searchTerm, priceRange, currentPage]);

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
        page: currentPage
      };

      const data = await apiService.getProducts(params);
      
      // Debug: afficher les données reçues
      console.log('Données produits reçues:', data);
      if (data && data.length > 0) {
        console.log('Premier produit:', data[0]);
        console.log('Images du premier produit:', data[0].images);
        console.log('Catégorie du premier produit:', data[0].category);
      }
      
      if (data && Array.isArray(data.results)) {
        setProducts(data.results);
        setTotalPages(data.total_pages || 1);
      } else if (Array.isArray(data)) {
        setProducts(data);
        setTotalPages(1);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Impossible de charger les produits. Vérifiez votre connexion.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Loading categories...');
      const data = await apiService.getCategories();
      console.log('Categories loaded:', data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback aux catégories statiques
      setCategories(
        PRODUCT_CATEGORIES.map((cat, index) => ({ 
          id: index + 1, 
          name: cat,
          slug: cat.toLowerCase().replace(/\s+/g, '-')
        }))
      );
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('name');
    setPriceRange([0, 10000]);
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await apiService.addToCart(productId, quantity);
      alert('Produit ajouté au panier !');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Erreur lors de l\'ajout au panier. Veuillez vous connecter.');
    }
  };

  const handleToggleFavorite = async (productId) => {
    try {
      setFavoritesLoading(prev => ({ ...prev, [productId]: true }));
      await apiService.toggleFavorite(productId);
      
      // Mettre à jour l'état local
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, is_favorite: !product.is_favorite }
          : product
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Veuillez vous connecter pour ajouter aux favoris.');
    } finally {
      setFavoritesLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleStartChat = (farmer) => {
    setSelectedFarmer(farmer);
    setChatDialogOpen(true);
  };

  const handleConfirmChat = () => {
    if (selectedFarmer) {
      navigate(`/chat?farmer=${selectedFarmer.id}`);
      setChatDialogOpen(false);
    }
  };

  const handleViewProductDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
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
          <MenuItem value="name">Nom (A-Z)</MenuItem>
          <MenuItem value="-name">Nom (Z-A)</MenuItem>
          <MenuItem value="price">Prix: Croissant</MenuItem>
          <MenuItem value="-price">Prix: Décroissant</MenuItem>
          <MenuItem value="-created_at">Nouveautés</MenuItem>
          <MenuItem value="-rating">Meilleures notes</MenuItem>
          <MenuItem value="-stock">Stock disponible</MenuItem>
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
        sx={{ mt: 2 }}
      >
        Effacer les filtres
      </Button>
    </Drawer>
  );

  // Composant de carte de produit
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
      {/* Badge "En stock" */}
      {product.stock <= 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'error.main',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            zIndex: 1,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            RUPTURE
          </Typography>
        </Box>
      )}

      {/* Image du produit - CORRIGÉ */}
      <CardMedia
        component="img"
        height="200"
        image={getProductImage(product)}
        alt={product.name}
        sx={{
          objectFit: 'cover',
          cursor: 'pointer',
          opacity: product.stock <= 0 ? 0.5 : 1,
        }}
        onClick={() => handleViewProductDetails(product.id)}
        onError={(e) => {
          // Fallback en cas d'erreur de chargement
          e.target.src = '/placeholder-product.jpg';
        }}
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
            disabled={favoritesLoading[product.id]}
          >
            {favoritesLoading[product.id] ? (
              <CircularProgress size={20} />
            ) : product.is_favorite ? (
              <Favorite />
            ) : (
              <FavoriteBorder />
            )}
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
            value={product.rating || 0}
            precision={0.5}
            size="small"
            readOnly
          />
          <Typography variant="body2" color="text.secondary">
            ({product.review_count || 0})
          </Typography>
        </Box>

        {/* Prix */}
        <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
          {parseFloat(product.price).toLocaleString('fr-FR')} FCFA
          <Typography component="span" variant="body2" color="text.secondary">
            / {product.unit}
          </Typography>
        </Typography>

        {/* Informations supplémentaires */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {product.stock > 0 && (
            <Chip
              label={`Stock: ${product.stock}`}
              size="small"
              color="success"
              variant="outlined"
              icon={<InventoryIcon />}
            />
          )}
          {/* Catégorie - CORRIGÉ */}
          <Chip
            label={getCategoryName(product)}
            size="small"
            color="info"
            variant="outlined"
          />
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => handleAddToCart(product.id)}
              size="small"
              disabled={product.stock <= 0}
              sx={{ flex: 1 }}
            >
              {product.stock > 0 ? 'Ajouter' : 'Rupture'}
            </Button>
            <Tooltip title="Contacter l'agriculteur">
              <Button
                variant="outlined"
                startIcon={<Message />}
                onClick={() => handleStartChat(product.farmer)}
                size="small"
                sx={{ flex: 1 }}
              >
                Contacter
              </Button>
            </Tooltip>
          </Box>
          <Button
            fullWidth
            variant="text"
            startIcon={<Visibility />}
            onClick={() => handleViewProductDetails(product.id)}
            size="small"
          >
            Voir détails
          </Button>
        </Box>
      </CardActions>
    </Card>
  );

  // Composant Grid personnalisé
  const Grid = ({ children, spacing = 3, ...props }) => (
    <Box
      sx={{
        display: 'grid',
        gap: spacing,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );

  const GridItem = ({ children, ...props }) => (
    <Box {...props}>{children}</Box>
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
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
        </Box>
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
              label={`Catégorie: ${categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}`}
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
          <Typography variant="body1" sx={{ ml: 2, alignSelf: 'center' }}>
            Chargement des produits...
          </Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Vue Grid */}
          {viewMode === 'grid' && (
            <>
              <Grid spacing={3}>
                <AnimatePresence>
                  {products.map((product, index) => (
                    <GridItem key={product.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <EnhancedProductCard product={product} />
                      </motion.div>
                    </GridItem>
                  ))}
                </AnimatePresence>
              </Grid>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}

          {/* Message vide */}
          {products.length === 0 && !loading && (
            <Fade in>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Aucun produit trouvé
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Essayez d'ajuster vos critères de recherche ou de filtre
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={handleClearFilters}
                >
                  Effacer tous les filtres
                </Button>
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
          {selectedFarmer?.phone_number && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              📞 {selectedFarmer.phone_number}
            </Typography>
          )}
          {selectedFarmer?.email && (
            <Typography variant="body2" color="text.secondary">
              📧 {selectedFarmer.email}
            </Typography>
          )}
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