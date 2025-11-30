import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Visibility,
  LocalShipping
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

const Orders = () => {
  const { user } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Données mockées
  const orders = [
    {
      id: 1,
      date: '2024-01-20',
      total: 8500,
      status: 'confirmed',
      items: [
        { product: 'Tomates', quantity: 2, price: 1200 },
        { product: 'Oignons', quantity: 1, price: 800 }
      ],
      farmer: { name: 'Jean Dupont' },
      customer: { name: 'Marie Lambert' }
    }
  ]

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

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setDialogOpen(true)
  }

  const handleUpdateStatus = (orderId, newStatus) => {
    console.log('Mettre à jour statut:', orderId, newStatus)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {user?.role === 'farmer' ? 'Commandes Reçues' : 'Mes Commandes'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {user?.role === 'farmer' 
            ? 'Gérez les commandes de vos clients' 
            : 'Suivez l\'état de vos commandes'
          }
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Commande</TableCell>
              <TableCell>Date</TableCell>
              {user?.role === 'farmer' && <TableCell>Client</TableCell>}
              {user?.role === 'customer' && <TableCell>Agriculteur</TableCell>}
              <TableCell>Montant</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Commande #{order.id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {order.items.length} article(s)
                  </Typography>
                </TableCell>
                
                <TableCell>
                  {new Date(order.date).toLocaleDateString('fr-FR')}
                </TableCell>
                
                <TableCell>
                  {user?.role === 'farmer' 
                    ? order.customer.name 
                    : order.farmer.name
                  }
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
                
                <TableCell align="right">
                  <Button
                    startIcon={<Visibility />}
                    onClick={() => handleViewOrder(order)}
                    size="small"
                  >
                    Détails
                  </Button>
                  
                  {user?.role === 'farmer' && order.status === 'confirmed' && (
                    <Button
                      startIcon={<LocalShipping />}
                      onClick={() => handleUpdateStatus(order.id, 'preparing')}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      Préparer
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Détails de la commande #{selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Articles commandés
              </Typography>
              {selectedOrder.items.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>{item.product}</Typography>
                  <Typography>
                    {item.quantity} x {item.price} FCFA = {item.quantity * item.price} FCFA
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">{selectedOrder.total} FCFA</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Orders