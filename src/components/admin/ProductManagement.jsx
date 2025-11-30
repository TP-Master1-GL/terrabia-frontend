import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  Search,
  Edit,
  Delete,
  Visibility,
  Block,
  CheckCircle
} from '@mui/icons-material'
import { PRODUCT_CATEGORIES } from '../../utils/Constants'

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Tomates Fraîches',
      category: 'Légumes',
      price: 1200,
      quantity: 50,
      unit: 'kg',
      farmer: { name: 'Jean Dupont' },
      status: 'active',
      created_at: '2024-01-15',
      rating: 4.5,
      sales: 24
    }
  ])

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error'
  }

  const getStatusText = (status) => {
    return status === 'active' ? 'Actif' : 'Inactif'
  }

  const handleToggleStatus = (productId) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
          : product
      )
    )
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || product.category === selectedCategory)
  )

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Gestion des Produits
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Catégorie"
            >
              <MenuItem value="">Toutes</MenuItem>
              {PRODUCT_CATEGORIES.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Agriculteur</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Ventes</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID: {product.id}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {product.farmer.name}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Chip label={product.category} size="small" color="primary" />
                </TableCell>
                
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {product.price} FCFA
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    / {product.unit}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {product.quantity} {product.unit}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {product.sales} ventes
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {product.rating}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      /5
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={getStatusText(product.status)} 
                    color={getStatusColor(product.status)}
                    size="small"
                  />
                </TableCell>
                
                <TableCell align="right">
                  <IconButton color="info" size="small">
                    <Visibility />
                  </IconButton>
                  <IconButton 
                    color={product.status === 'active' ? 'warning' : 'success'}
                    size="small"
                    onClick={() => handleToggleStatus(product.id)}
                  >
                    {product.status === 'active' ? <Block /> : <CheckCircle />}
                  </IconButton>
                  <IconButton color="error" size="small">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default ProductManagement