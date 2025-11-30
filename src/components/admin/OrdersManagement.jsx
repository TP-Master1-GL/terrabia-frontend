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
  Menu,
  MenuItem
} from '@mui/material'
import {
  Search,
  MoreVert,
  Visibility,
  LocalShipping
} from '@mui/icons-material'

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: { name: 'Client Test', email: 'customer@test.com' },
      farmer: { name: 'Agriculteur Test' },
      total: 8500,
      status: 'confirmed',
      items: 3,
      created_at: '2024-01-20',
      delivery_status: 'pending'
    }
  ])

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget)
    setSelectedOrder(order)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedOrder(null)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'default',
      confirmed: 'primary',
      preparing: 'secondary',
      ready: 'warning',
      in_delivery: 'info',
      delivered: 'success',
      cancelled: 'error'
    }
    return colors[status] || 'default'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      preparing: 'En préparation',
      ready: 'Prête',
      in_delivery: 'En livraison',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    }
    return texts[status] || status
  }

  const getDeliveryStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      assigned: 'info',
      in_progress: 'secondary',
      delivered: 'success',
      cancelled: 'error'
    }
    return colors[status] || 'default'
  }

  const getDeliveryStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      assigned: 'Assignée',
      in_progress: 'En cours',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    }
    return texts[status] || status
  }

  const filteredOrders = orders.filter(order =>
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  )

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Gestion des Commandes
        </Typography>
        
        <TextField
          placeholder="Rechercher une commande..."
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
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Commande</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Agriculteur</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Livraison</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Commande #{order.id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {order.items} article(s)
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">
                      {order.customer.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.customer.email}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {order.farmer.name}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {order.total} FCFA
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={getStatusText(order.status)} 
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={getDeliveryStatusText(order.delivery_status)} 
                    color={getDeliveryStatusColor(order.delivery_status)}
                    size="small"
                    icon={<LocalShipping />}
                  />
                </TableCell>
                
                <TableCell>
                  {order.created_at}
                </TableCell>
                
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, order)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Visibility sx={{ mr: 1 }} />
          Voir les détails
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <LocalShipping sx={{ mr: 1 }} />
          Assigner une livraison
        </MenuItem>
      </Menu>
    </Paper>
  )
}

export default OrderManagement