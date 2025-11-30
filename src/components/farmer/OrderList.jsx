import React from 'react'
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
  ListItemText
} from '@mui/material'
import {
  LocalShipping,
  CheckCircle,
  Schedule
} from '@mui/icons-material'

const OrderList = ({ orders, onUpdateStatus }) => {
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

  const getNextStatusAction = (currentStatus) => {
    const actions = {
      pending: { text: 'Confirmer', status: 'confirmed', icon: <CheckCircle /> },
      confirmed: { text: 'Préparer', status: 'preparing', icon: <Schedule /> },
      preparing: { text: 'Prête', status: 'ready', icon: <LocalShipping /> },
      ready: { text: 'En livraison', status: 'in_delivery', icon: <LocalShipping /> }
    }
    return actions[currentStatus]
  }

  return (
    <Box>
      {orders.length === 0 ? (
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
      ) : (
        <List>
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
                        Client: {order.customer.name} • {order.customer.phone}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Livraison: {order.delivery_address}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip 
                        label={getStatusText(order.status)} 
                        color={getStatusColor(order.status)}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h6" color="primary">
                        {order.total} FCFA
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Articles commandés:
                  </Typography>
                  <List dense>
                    {order.items.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={item.product}
                          secondary={`${item.quantity} x ${item.price} FCFA = ${item.quantity * item.price} FCFA`}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Commandé le: {order.created_at}
                    </Typography>
                    
                    {nextAction && (
                      <Button
                        variant="contained"
                        startIcon={nextAction.icon}
                        onClick={() => onUpdateStatus(order.id, nextAction.status)}
                      >
                        {nextAction.text}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            )
          })}
        </List>
      )}
    </Box>
  )
}

export default OrderList