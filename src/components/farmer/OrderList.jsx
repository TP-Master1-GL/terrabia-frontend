// components/Farmer/OrderList.js
import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  LocalShipping,
  CheckCircle,
  Schedule
} from '@mui/icons-material'

const OrderList = ({ orders, onUpdateStatus, loading, error }) => {
  const [updatingOrder, setUpdatingOrder] = useState(null)

  const getStatusColor = (status) => {
    const colors = {
      pending: 'default',
      confirmed: 'primary',
      preparing: 'secondary',
      ready: 'warning',
      shipped: 'info',
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
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    }
    return texts[status] || status
  }

  const getNextStatusAction = (currentStatus) => {
    const actions = {
      pending: { text: 'Confirmer', status: 'confirmed', icon: <CheckCircle /> },
      confirmed: { text: 'Préparer', status: 'preparing', icon: <Schedule /> },
      preparing: { text: 'Prête', status: 'ready', icon: <LocalShipping /> },
      ready: { text: 'Expédier', status: 'shipped', icon: <LocalShipping /> }
    }
    return actions[currentStatus]
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrder(orderId)
    try {
      await onUpdateStatus(orderId, newStatus)
    } catch (error) {
      console.error('Error updating order status:', error)
    } finally {
      setUpdatingOrder(null)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="textSecondary">
            Aucune commande pour le moment
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Vos commandes apparaîtront ici
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box>
      {orders.map((order) => {
        const nextAction = getNextStatusAction(order.status)
        
        return (
          <Card key={order.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Commande #{order.id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Client: {order.buyer_info?.first_name} {order.buyer_info?.last_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Téléphone: {order.buyer_info?.phone_number || 'Non renseigné'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Livraison: {order.shipping_address}
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'right' }}>
                  <Chip 
                    label={getStatusText(order.status)} 
                    color={getStatusColor(order.status)}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    {parseFloat(order.total_amount || 0).toLocaleString()} FCFA
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Articles commandés:
              </Typography>
              <List dense>
                {order.items?.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item.product_name}
                      secondary={`${item.quantity} x ${parseFloat(item.unit_price).toLocaleString()} FCFA = ${parseFloat(item.total_price).toLocaleString()} FCFA`}
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Commandé le: {new Date(order.created_at).toLocaleDateString('fr-FR')}
                </Typography>
                
                {nextAction && (
                  <Button
                    variant="contained"
                    startIcon={updatingOrder === order.id ? <CircularProgress size={16} /> : nextAction.icon}
                    onClick={() => handleStatusUpdate(order.id, nextAction.status)}
                    disabled={updatingOrder === order.id}
                  >
                    {updatingOrder === order.id ? 'Mise à jour...' : nextAction.text}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        )
      })}
    </Box>
  )
}

export default OrderList