import React, { useState, useRef, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Badge,
  Chip
} from '@mui/material'
import {
  Send,
  AttachFile,
  Done,
  DoneAll
} from '@mui/icons-material'

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'farmer',
      content: 'Bonjour ! Je suis intéressé par vos tomates.',
      timestamp: new Date('2024-01-20T10:30:00'),
      read: true
    },
    {
      id: 2,
      sender: 'customer',
      content: 'Bonjour ! Elles sont fraîchement récoltées ce matin. 1200 FCFA le kg.',
      timestamp: new Date('2024-01-20T10:32:00'),
      read: true
    },
    {
      id: 3,
      sender: 'farmer',
      content: 'Parfait ! Je prends 2kg. Pouvez-vous me les livrer demain ?',
      timestamp: new Date('2024-01-20T10:33:00'),
      read: false
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return

    const message = {
      id: messages.length + 1,
      sender: 'customer', // En vrai, utiliser l'utilisateur connecté
      content: newMessage,
      timestamp: new Date(),
      read: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const markAsRead = (messageId) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    )
  }

  const getReadStatusIcon = (message) => {
    if (message.sender === 'customer') {
      return message.read ? <DoneAll color="primary" /> : <Done color="disabled" />
    }
    return null
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Messagerie
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Communiquez avec les agriculteurs et clients
        </Typography>
      </Box>

      <Paper sx={{ height: '70vh', display: 'flex' }}>
        {/* Liste des conversations */}
        <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Conversations</Typography>
          </Box>
          <List>
            <ListItem button selected sx={{ backgroundColor: 'primary.light' }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>JD</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">Jean Dupont</Typography>
                    <Chip label="Agriculteur" size="small" color="primary" />
                  </Box>
                }
                secondary="Dernier message: Il y a 2 min"
              />
              <Badge color="error" variant="dot" />
            </ListItem>
            <ListItem button>
              <ListItemAvatar>
                <Avatar>ML</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Marie Lambert"
                secondary="Dernier message: Il y a 1h"
              />
            </ListItem>
          </List>
        </Box>

        {/* Zone de chat */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* En-tête de conversation */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>JD</Avatar>
            <Box>
              <Typography variant="h6">Jean Dupont</Typography>
              <Typography variant="body2" color="textSecondary">
                <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'success.main', display: 'inline-block', mr: 1 }} />
                En ligne
              </Typography>
            </Box>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2, backgroundColor: 'grey.50' }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'customer' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
                onClick={() => markAsRead(message.id)}
              >
                <Box sx={{ maxWidth: '70%' }}>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: message.sender === 'customer' ? 'primary.main' : 'white',
                      color: message.sender === 'customer' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mt: 0.5 }}>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {message.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                      {getReadStatusIcon(message)}
                    </Box>
                  </Paper>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Zone de saisie */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <IconButton size="small">
                <AttachFile />
              </IconButton>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Tapez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <IconButton 
                color="primary" 
                onClick={handleSendMessage}
                disabled={newMessage.trim() === ''}
                sx={{ 
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.300'
                  }
                }}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default Chat