import React, { useState, useEffect } from 'react'
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
  Pagination,
  Chip,
  Paper
} from '@mui/material'
import {
  Search,
  Tune
} from '@mui/icons-material'
import ProductCard from '../../components/Customer/ProductCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { PRODUCT_CATEGORIES } from '../../utils/Constants'

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])

  // Données mockées pour les produits
  const mockProducts = [
    {
      id: 1,
      name: 'Tomates Fraîches',
      category: 'Légumes',
      price: 1200,
      quantity: 50,
      unit: 'kg',
      description: 'Tomates rouges et juteuses cultivées localement, riches en vitamines et antioxydants. Parfaites pour vos salades et sauces.',
      images: ['/placeholder-product.jpg'],
      farmer: { name: 'Jean Dupont' },
      rating: 4.5,
      review_count: 24,
      is_available: true
    },
    {
      id: 2,
      name: 'Bananes Plantains',
      category: 'Fruits',
      price: 800,
      quantity: 30,
      unit: 'kg',
      description: 'Bananes plantains mûres à point, idéales pour la cuisson. Produites dans nos plantations biologiques.',
      images: ['/placeholder-product.jpg'],
      farmer: { name: 'Marie Lambert' },
      rating: 4.2,
      review_count: 18,
      is_available: true
    },
    {
      id: 3,
      name: 'Oignons Locaux',
      category: 'Légumes',
      price: 600,
      quantity: 100,
      unit: 'kg',
      description: 'Oignons frais et parfumés, récoltés manuellement. Conservation excellente.',
      images: ['/placeholder-product.jpg'],
      farmer: { name: 'Pierre Ngo' },
      rating: 4.7,
      review_count: 32,
      is_available: true
    },
    {
      id: 4,
      name: 'Piments Frais',
      category: 'Épices',
      price: 300,
      quantity: 25,
      unit: 'kg',
      description: 'Piments frais et piquants, parfaits pour relever vos plats. Différents niveaux de force disponibles.',
      images: ['/placeholder-product.jpg'],
      farmer: { name: 'Alice Mbarga' },
      rating: 4.3,
      review_count: 15,
      is_available: true
    },
    {
      id: 5,
      name: 'Aubergines Africaines',
      category: 'Légumes',
      price: 700,
      quantity: 40,
      unit: 'kg',
      description: 'Aubergines fraîches et fermes, excellentes pour les ragoûts et plats traditionnels.',
      images: ['/placeholder-product.jpg'],
      farmer: { name: 'David Fokou' },
      rating: 4.6,
      review_count: 21,
      is_available: true
    },
    {
      id: 6,
      name: 'Manioc',
      category: 'Tubercules',
      price: 400,
      quantity: 80,
      unit: 'kg',
      description: 'Manioc frais de première qualité, parfait pour le bâton de manioc ou la farine.',
      images: ['/placeholder-product.jpg'],
      farmer: { name: 'Sophie Kana' },
      rating: 4.4,
      review_count: 28,
      is_available: true
    }
  ]

  useEffect(() => {
    setLoading(true)
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setPage(1)
  }

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
    setPage(1)
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Filtrer et trier les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price
      case '-price':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  // Fonctions mockées pour l'instant
  const handleAddToCart = (productId, quantity) => {
    console.log('Ajouter au panier:', productId, quantity)
    // Stocker dans le localStorage
    const cart = JSON.parse(localStorage.getItem('terrabia_cart') || '[]')
    const existingItem = cart.find(item => item.productId === productId)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ productId, quantity })
    }
    
    localStorage.setItem('terrabia_cart', JSON.stringify(cart))
    alert('Produit ajouté au panier!')
  }

  const handleToggleFavorite = (productId, isFavorite) => {
    console.log('Toggle favori:', productId, isFavorite)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Nos Produits
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Découvrez nos produits agricoles frais directement des fermes
        </Typography>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Catégorie"
              >
                <MenuItem value="">Toutes les catégories</MenuItem>
                {PRODUCT_CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Trier par"
              >
                <MenuItem value="name">Nom</MenuItem>
                <MenuItem value="price">Prix croissant</MenuItem>
                <MenuItem value="-price">Prix décroissant</MenuItem>
                <MenuItem value="rating">Meilleures notes</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {selectedCategory && (
                <Chip
                  label={`Catégorie: ${selectedCategory}`}
                  onDelete={() => setSelectedCategory('')}
                  size="small"
                />
              )}
              {searchTerm && (
                <Chip
                  label={`Recherche: ${searchTerm}`}
                  onDelete={() => setSearchTerm('')}
                  size="small"
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Liste des produits */}
      {loading ? (
        <LoadingSpinner message="Chargement des produits..." />
      ) : (
        <>
          <Grid container spacing={3}>
            {sortedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Grid>
            ))}
          </Grid>

          {sortedProducts.length === 0 && (
            <Box textAlign="center" py={6}>
              <Typography variant="h6" color="textSecondary">
                Aucun produit trouvé
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Essayez de modifier vos critères de recherche
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {sortedProducts.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(sortedProducts.length / 12)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default Products