// src/pages/shared/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Chip,
  InputAdornment,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  Tooltip,
} from '@mui/material';
import {
  Send,
  Search,
  MoreVert,
  AttachFile,
  EmojiEmotions,
  Phone,
  VideoCall,
  Person,
  Agriculture,
  LocalShipping,
  Info,
  Done,
  DoneAll,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import { motion, AnimatePresence } from 'framer-motion';

// Déterminer le fuseau horaire de l'utilisateur
const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Impossible de détecter le fuseau horaire, utilisation par défaut', error);
    return 'Europe/Paris'; // Fuseau horaire par défaut
  }
};

// Formater la date selon les préférences locales de l'utilisateur
const formatDateLocal = (dateString, options = {}) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    });
  } catch (error) {
    console.error('Erreur formatage date:', error);
    return '';
  }
};

// Formater l'heure selon les préférences locales de l'utilisateur
const formatTimeLocal = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch (error) {
    console.error('Erreur formatage heure:', error);
    return '';
  }
};

// Formater la date et l'heure complètes
const formatDateTimeLocal = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch (error) {
    console.error('Erreur formatage date/heure:', error);
    return '';
  }
};

// Fonction pour formater la date relative (il y a...)
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'à l\'instant';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'à l\'instant';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 0) return 'à l\'instant';
    if (diffInSeconds < 60) return 'à l\'instant';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      if (diffInHours === 1) return 'il y a 1 heure';
      return `il y a ${diffInHours} heures`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'hier';
    if (diffInDays < 7) {
      return `il y a ${diffInDays} jours`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks === 1) return 'il y a 1 semaine';
    if (diffInWeeks < 4) {
      return `il y a ${diffInWeeks} semaines`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths === 1) return 'il y a 1 mois';
    if (diffInMonths < 12) {
      return `il y a ${diffInMonths} mois`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    if (diffInYears === 1) return 'il y a 1 an';
    return `il y a ${diffInYears} ans`;
  } catch (error) {
    console.error('Erreur formatage time ago:', error);
    return '';
  }
};

// Vérifier si une date est aujourd'hui
const isToday = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    console.error('Erreur vérification date:', error);
    return false;
  }
};

// Vérifier si une date est hier
const isYesterday = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  } catch (error) {
    console.error('Erreur vérification hier:', error);
    return false;
  }
};

// Formater la date pour l'affichage des groupes
const formatGroupDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    if (isToday(dateString)) {
      return 'Aujourd\'hui';
    }
    
    if (isYesterday(dateString)) {
      return 'Hier';
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    // Pour les dates de cette année, afficher seulement le jour et mois
    const currentYear = new Date().getFullYear();
    if (date.getFullYear() === currentYear) {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }
    
    // Pour les dates des autres années
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Erreur formatage groupe date:', error);
    return '';
  }
};

// Composant pour les indicateurs de statut des messages (coches)
const MessageStatusIndicator = ({ status, readAt, isOwnMessage }) => {
  if (!isOwnMessage) return null;

  let icon = null;
  let color = 'rgba(255, 255, 255, 0.6)';
  let tooltipText = 'Envoyé';

  switch (status) {
    case 'sent':
      icon = <Done fontSize="inherit" />;
      tooltipText = 'Envoyé';
      break;
    case 'delivered':
      icon = <DoneAll fontSize="inherit" />;
      tooltipText = 'Reçu';
      break;
    case 'read':
      icon = <DoneAll fontSize="inherit" />;
      color = '#4fc3f7'; // Bleu WhatsApp
      tooltipText = readAt ? `Lu à ${formatTimeLocal(readAt)}` : 'Lu';
      break;
    case 'failed':
      icon = <Done fontSize="inherit" sx={{ color: 'error.main' }} />;
      tooltipText = 'Échec d\'envoi';
      return (
        <Tooltip title={tooltipText}>
          <Box component="span" sx={{ ml: 0.5 }}>
            {icon}
          </Box>
        </Tooltip>
      );
    default:
      icon = <Done fontSize="inherit" />;
      tooltipText = 'Envoyé';
  }

  return (
    <Tooltip title={tooltipText}>
      <Box component="span" sx={{ ml: 0.5, display: 'inline-flex', alignItems: 'center' }}>
        {React.cloneElement(icon, { sx: { fontSize: '0.875rem', color } })}
      </Box>
    </Tooltip>
  );
};

// Composant pour afficher l'heure avec tooltip de date complète
const TimeWithTooltip = ({ dateString, showRelative = true }) => {
  const time = formatTimeLocal(dateString);
  const fullDateTime = formatDateTimeLocal(dateString);
  const timeAgo = showRelative ? formatTimeAgo(dateString) : null;

  return (
    <Tooltip title={fullDateTime} arrow placement="top">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            opacity: 0.8,
            fontSize: '0.75rem',
          }}
        >
          {time}
        </Typography>
        {showRelative && timeAgo && (
          <Typography
            variant="caption"
            sx={{
              opacity: 0.6,
              fontSize: '0.65rem',
              fontStyle: 'italic',
            }}
          >
            ({timeAgo})
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

const Chat = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userTimezone = useRef(getUserTimezone());

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState({
    conversations: true,
    messages: false,
    sending: false,
  });
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    console.log('👤 Utilisateur connecté:', user);
    console.log('🌍 Fuseau horaire détecté:', userTimezone.current);
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      console.log('💬 Conversation sélectionnée:', selectedConversation.id);
      loadMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading((prev) => ({ ...prev, conversations: true }));
      console.log('📞 Chargement des conversations...');
      
      const data = await apiService.getConversations();
      console.log('✅ Conversations chargées:', data);
      
      // Traiter les dates des conversations
      const processedConversations = (data || []).map(conv => ({
        ...conv,
        // Formater la dernière date de message
        last_message: conv.last_message ? {
          ...conv.last_message,
          formatted_time: formatTimeLocal(conv.last_message.created_at),
          time_ago: formatTimeAgo(conv.last_message.created_at),
        } : null,
      }));
      
      setConversations(processedConversations);
      if (data && data.length > 0 && !selectedConversation) {
        console.log('🎯 Première conversation sélectionnée:', data[0]);
        setSelectedConversation(processedConversations[0]);
      }
    } catch (err) {
      console.error('❌ Erreur chargement conversations:', err);
      showError('Impossible de charger les conversations');
    } finally {
      setLoading((prev) => ({ ...prev, conversations: false }));
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoading((prev) => ({ ...prev, messages: true }));
      console.log(`💌 Chargement messages conversation ${conversationId}...`);
      
      const data = await apiService.getMessages(conversationId);
      console.log(`✅ Messages chargés pour ${conversationId}:`, data);
      
      // Traiter les dates des messages
      const processedMessages = (data || []).map(msg => ({
        ...msg,
        status: msg.status || 'sent',
        read_at: msg.read_at || null,
        formatted_time: formatTimeLocal(msg.created_at),
        formatted_date: formatDateLocal(msg.created_at, { weekday: 'long' }),
        time_ago: formatTimeAgo(msg.created_at),
        full_datetime: formatDateTimeLocal(msg.created_at),
      }));
      
      setMessages(processedMessages);
    } catch (err) {
      console.error(`❌ Erreur chargement messages ${conversationId}:`, err);
      showError('Impossible de charger les messages');
    } finally {
      setLoading((prev) => ({ ...prev, messages: false }));
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      console.log(`📖 Marquage conversation ${conversationId} comme lue`);
      await apiService.markAsRead(conversationId);
      
      // Mettre à jour le compteur de non lus dans la liste
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
        )
      );
    } catch (err) {
      console.error('❌ Erreur marquage comme lu:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !selectedConversation || loading.sending) return;

    try {
      setLoading((prev) => ({ ...prev, sending: true }));
      
      console.log(`📤 Envoi message à conversation ${selectedConversation.id}:`, newMessage);
      
      // Créer un message temporaire pour l'UI
      const now = new Date();
      const tempMessage = {
        id: Date.now(), // ID temporaire
        content: newMessage.trim(),
        created_at: now.toISOString(),
        sender: user,
        isTemp: true,
        status: 'sent',
        formatted_time: formatTimeLocal(now.toISOString()),
        formatted_date: formatDateLocal(now.toISOString(), { weekday: 'long' }),
        time_ago: 'à l\'instant',
        full_datetime: formatDateTimeLocal(now.toISOString()),
      };
      
      // Ajouter le message temporaire immédiatement
      setMessages((prev) => [...prev, tempMessage]);
      const originalMessage = newMessage;
      setNewMessage('');
      
      // Envoyer au serveur
      const messageData = await apiService.sendMessage(
        selectedConversation.id,
        originalMessage.trim()
      );

      console.log('✅ Message envoyé avec succès:', messageData);

      // Remplacer le message temporaire par la réponse du serveur
      const processedMessage = {
        ...messageData,
        status: messageData.status || 'sent',
        read_at: messageData.read_at || null,
        formatted_time: formatTimeLocal(messageData.created_at),
        formatted_date: formatDateLocal(messageData.created_at, { weekday: 'long' }),
        time_ago: formatTimeAgo(messageData.created_at),
        full_datetime: formatDateTimeLocal(messageData.created_at),
      };
      
      setMessages((prev) =>
        prev.map((msg) => 
          msg.isTemp && msg.content === originalMessage ? processedMessage : msg
        )
      );
      
      setTimeout(scrollToBottom, 100);
      
      // Mettre à jour la dernière conversation
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? { 
                ...conv, 
                last_message: {
                  ...processedMessage,
                  created_at: processedMessage.created_at || now.toISOString(),
                }
              }
            : conv
        )
      );
      
      showSuccess('Message envoyé avec succès');
      
    } catch (err) {
      console.error('❌ Erreur envoi message:', err);
      showError('Impossible d\'envoyer le message');
      // Marquer le message temporaire comme échoué
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isTemp && msg.content === originalMessage
            ? { ...msg, status: 'failed' }
            : msg
        )
      );
    } finally {
      setLoading((prev) => ({ ...prev, sending: false }));
    }
  };

  const getParticipantInfo = (conversation) => {
    if (!conversation.participants) return null;
    return conversation.participants.find((p) => p.id !== user?.id);
  };

  const getUserIcon = (userType) => {
    switch (userType) {
      case 'farmer':
        return <Agriculture />;
      case 'delivery':
        return <LocalShipping />;
      default:
        return <Person />;
    }
  };

  const getUserColor = (userType) => {
    switch (userType) {
      case 'farmer':
        return 'success';
      case 'delivery':
        return 'info';
      case 'admin':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const showError = (message) => {
    console.error('🚨 Erreur:', message);
    setSnackbar({
      open: true,
      message,
      severity: 'error',
    });
  };

  const showSuccess = (message) => {
    console.log('✅ Succès:', message);
    setSnackbar({
      open: true,
      message,
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const filteredConversations = conversations.filter((conv) => {
    const participant = getParticipantInfo(conv);
    if (!participant) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      participant.first_name?.toLowerCase().includes(searchLower) ||
      participant.last_name?.toLowerCase().includes(searchLower) ||
      participant.email?.toLowerCase().includes(searchLower) ||
      conv.last_message?.content?.toLowerCase().includes(searchLower)
    );
  });

  const getLastMessageTime = (conversation) => {
    if (!conversation.last_message?.created_at) return '';
    return conversation.last_message.formatted_time || formatTimeLocal(conversation.last_message.created_at);
  };

  const handleRetryLoadConversations = () => {
    loadConversations();
  };

  // Fonction pour regrouper les messages par date
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    
    messages.forEach((message) => {
      const messageDate = formatGroupDate(message.created_at);
      
      if (messageDate !== currentDate) {
        groups.push({
          type: 'date',
          date: messageDate,
          timestamp: message.created_at,
          full_date: formatDateLocal(message.created_at),
        });
        currentDate = messageDate;
      }
      
      groups.push({
        type: 'message',
        data: message,
      });
    });
    
    return groups;
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4, height: 'calc(100vh - 100px)' }}>
        <Paper
          sx={{
            height: '100%',
            display: 'flex',
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: theme.shadows[3],
          }}
        >
          {/* Liste des conversations */}
          <Box
            sx={{
              width: isMobile ? '100%' : 380,
              borderRight: 1,
              borderColor: 'divider',
              display: selectedConversation && isMobile ? 'none' : 'flex',
              flexDirection: 'column',
              backgroundColor: '#fafafa',
            }}
          >
            {/* En-tête liste */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info fontSize="small" />
                Messages
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  ({userTimezone.current})
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={handleRetryLoadConversations}
                  disabled={loading.conversations}
                  title="Rafraîchir"
                >
                  <CircularProgress size={20} sx={{ display: loading.conversations ? 'block' : 'none' }} />
                </IconButton>
              </Typography>

              <TextField
                fullWidth
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            {/* Liste */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {loading.conversations ? (
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}
                >
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Chargement des conversations...
                  </Typography>
                </Box>
              ) : conversations.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                  <Typography color="text.secondary" variant="h6">
                    Aucune conversation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Commencez une nouvelle conversation avec un utilisateur
                  </Typography>
                  <IconButton 
                    onClick={handleRetryLoadConversations}
                    sx={{ mt: 2 }}
                  >
                    <Search />
                  </IconButton>
                </Box>
              ) : filteredConversations.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                  <Typography color="text.secondary">
                    Aucun résultat pour "{searchTerm}"
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  <AnimatePresence>
                    {filteredConversations.map((conversation) => {
                      const participant = getParticipantInfo(conversation);
                      const isSelected = selectedConversation?.id === conversation.id;
                      const unreadCount = conversation.unread_count || 0;

                      return (
                        <motion.div
                          key={conversation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <ListItem
                            button
                            selected={isSelected}
                            onClick={() => setSelectedConversation(conversation)}
                            sx={{
                              borderLeft: isSelected ? 4 : 0,
                              borderColor: 'primary.main',
                              backgroundColor: isSelected
                                ? 'action.selected'
                                : 'transparent',
                              '&:hover': {
                                backgroundColor: 'action.hover',
                              },
                              py: 1.5,
                            }}
                          >
                            <ListItemAvatar>
                              <Badge
                                badgeContent={unreadCount}
                                color="error"
                                overlap="circular"
                                invisible={unreadCount === 0}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: participant?.user_type 
                                      ? `${getUserColor(participant.user_type)}.light`
                                      : 'grey.300',
                                    color: participant?.user_type
                                      ? `${getUserColor(participant.user_type)}.main`
                                      : 'grey.600',
                                  }}
                                >
                                  {participant?.user_type ? getUserIcon(participant.user_type) : <Person />}
                                </Avatar>
                              </Badge>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                      variant="subtitle2"
                                      noWrap
                                      sx={{ 
                                        fontWeight: unreadCount > 0 ? 700 : 600,
                                        color: unreadCount > 0 ? 'text.primary' : 'text.primary',
                                      }}
                                    >
                                      {participant?.first_name} {participant?.last_name}
                                    </Typography>
                                    {participant?.user_type && (
                                      <Chip
                                        label={participant.user_type}
                                        size="small"
                                        color={getUserColor(participant.user_type)}
                                        sx={{
                                          height: 18,
                                          fontSize: '0.65rem',
                                          textTransform: 'capitalize',
                                        }}
                                      />
                                    )}
                                  </Box>
                                  {conversation.last_message?.created_at && (
                                    <Tooltip title={formatDateTimeLocal(conversation.last_message.created_at)}>
                                      <Typography variant="caption" color="text.secondary">
                                        {getLastMessageTime(conversation)}
                                      </Typography>
                                    </Tooltip>
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mt: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color={unreadCount > 0 ? 'text.primary' : 'text.secondary'}
                                    noWrap
                                    sx={{
                                      fontWeight: unreadCount > 0 ? 600 : 400,
                                      maxWidth: '70%',
                                    }}
                                  >
                                    {conversation.last_message?.content ||
                                      'Aucun message'}
                                  </Typography>
                                  
                                  {/* Indicateur de statut pour le dernier message */}
                                  {conversation.last_message?.sender?.id === user?.id && (
                                    <MessageStatusIndicator
                                      status={conversation.last_message?.status}
                                      readAt={conversation.last_message?.read_at}
                                      isOwnMessage={true}
                                    />
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                          <Divider />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </List>
              )}
            </Box>
          </Box>

          {/* Zone de chat */}
          <Box
            sx={{
              flex: 1,
              display: selectedConversation ? 'flex' : 'none',
              flexDirection: 'column',
            }}
          >
            {selectedConversation ? (
              <>
                {/* En-tête du chat */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                  }}
                >
                  {(() => {
                    const participant = getParticipantInfo(selectedConversation);
                    return (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <IconButton
                            size="small"
                            onClick={() => isMobile && setSelectedConversation(null)}
                            sx={{ display: { md: 'none' } }}
                          >
                            <MoreVert sx={{ transform: 'rotate(90deg)' }} />
                          </IconButton>
                          
                          <Avatar
                            sx={{
                              bgcolor: participant?.user_type 
                                ? `${getUserColor(participant.user_type)}.light`
                                : 'grey.300',
                              color: participant?.user_type
                                ? `${getUserColor(participant.user_type)}.main`
                                : 'grey.600',
                              width: 48,
                              height: 48,
                            }}
                          >
                            {participant?.user_type ? getUserIcon(participant.user_type) : <Person />}
                          </Avatar>

                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {participant?.first_name} {participant?.last_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {participant?.email}
                            </Typography>
                          </Box>

                          {participant?.user_type && (
                            <Chip
                              label={participant.user_type}
                              color={getUserColor(participant.user_type)}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" title="Appeler">
                            <Phone fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Vidéo">
                            <VideoCall fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Options">
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  })()}
                </Box>

                {/* Messages */}
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: { xs: 2, md: 3 },
                    backgroundColor: '#F5F7FA',
                  }}
                >
                  {loading.messages ? (
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}
                    >
                      <CircularProgress />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Chargement des messages...
                      </Typography>
                    </Box>
                  ) : messages.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary" variant="h6">
                        Aucun message
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Commencez la conversation en envoyant un message
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {groupMessagesByDate(messages).map((item, index) => {
                        if (item.type === 'date') {
                          return (
                            <Box
                              key={`date-${index}`}
                              sx={{
                                textAlign: 'center',
                                my: 2,
                              }}
                            >
                              <Tooltip title={item.full_date}>
                                <Chip
                                  label={item.date}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    fontWeight: 500,
                                    fontSize: '0.75rem',
                                  }}
                                />
                              </Tooltip>
                            </Box>
                          );
                        }

                        const message = item.data;
                        const isOwnMessage = message.sender?.id === user?.id;
                        const isTemp = message.isTemp;
                        const senderName = message.sender?.first_name || message.sender?.username || 'Utilisateur';

                        return (
                          <motion.div
                            key={message.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isTemp ? 0.7 : 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                              maxWidth: '80%',
                              minWidth: '120px',
                            }}
                          >
                            <Paper
                              elevation={isTemp ? 0 : 1}
                              sx={{
                                p: 2,
                                backgroundColor: isOwnMessage
                                  ? 'primary.main'
                                  : 'white',
                                color: isOwnMessage ? 'white' : 'text.primary',
                                borderRadius: 3,
                                borderTopRightRadius: isOwnMessage ? 4 : 16,
                                borderTopLeftRadius: isOwnMessage ? 16 : 4,
                                opacity: isTemp ? 0.7 : 1,
                                position: 'relative',
                              }}
                            >
                              {!isOwnMessage && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 600,
                                    display: 'block',
                                    mb: 0.5,
                                    color: 'text.secondary',
                                  }}
                                >
                                  {senderName}
                                </Typography>
                              )}
                              
                              <Typography variant="body1" sx={{ mb: 1, wordBreak: 'break-word' }}>
                                {message.content}
                              </Typography>

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mt: 1,
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <TimeWithTooltip 
                                    dateString={message.created_at} 
                                    showRelative={false}
                                  />
                                  
                                  {/* Indicateur de statut */}
                                  <MessageStatusIndicator
                                    status={message.status}
                                    readAt={message.read_at}
                                    isOwnMessage={isOwnMessage}
                                  />
                                </Box>
                                
                                {/* Info date relative au survol */}
                                <Tooltip title={message.full_datetime}>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      opacity: 0.6,
                                      fontSize: '0.7rem',
                                      ml: 1,
                                      color: isOwnMessage ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                                      fontStyle: 'italic',
                                    }}
                                  >
                                    {message.time_ago}
                                  </Typography>
                                </Tooltip>
                              </Box>
                            </Paper>
                          </motion.div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </Box>
                  )}
                </Box>

                {/* Input de message */}
                <Box
                  component="form"
                  onSubmit={handleSendMessage}
                  sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    backgroundColor: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <IconButton size="small" color="primary" title="Joindre un fichier">
                      <AttachFile fontSize="small" />
                    </IconButton>

                    <IconButton size="small" color="primary" title="Émojis">
                      <EmojiEmotions fontSize="small" />
                    </IconButton>

                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={loading.sending}
                      inputRef={messageInputRef}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                    />

                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || loading.sending}
                      title="Envoyer"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: 'grey.300',
                          color: 'grey.500',
                        },
                      }}
                    >
                      {loading.sending ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Send />
                      )}
                    </IconButton>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F5F7FA',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  {conversations.length === 0 ? 'Bienvenue dans la messagerie' : 'Sélectionnez une conversation'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {conversations.length === 0 
                    ? 'Commencez une conversation avec un autre utilisateur' 
                    : 'Choisissez une conversation pour commencer à discuter'}
                </Typography>
                {conversations.length === 0 && (
                  <Alert severity="info" sx={{ maxWidth: 400 }}>
                    Vous n'avez pas encore de conversations. Les conversations seront créées automatiquement lorsque vous interagirez avec d'autres utilisateurs.
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Chat;