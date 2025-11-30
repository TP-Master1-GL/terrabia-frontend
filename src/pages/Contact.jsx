import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SendIcon from '@mui/icons-material/Send'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulation d'envoi du formulaire
    console.log('Formulaire envoyé:', formData)
    setSubmitted(true)
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    
    // Reset du message de succès après 5 secondes
    setTimeout(() => setSubmitted(false), 5000)
  }

  const contactInfo = [
    {
      icon: <EmailIcon color="primary" />,
      title: 'Email',
      details: 'contact@terrabia.com',
      subtitle: 'Réponse sous 24h'
    },
    {
      icon: <PhoneIcon color="primary" />,
      title: 'Téléphone',
      details: '+237 6 91 15 92 96',
      subtitle: 'Lun-Ven: 8h-18h'
    },
    {
      icon: <WhatsAppIcon color="success" />,
      title: 'WhatsApp',
      details: '+237 6 91 15 92 96',
      subtitle: 'Support instantané'
    },
    {
      icon: <LocationOnIcon color="primary" />,
      title: 'Adresse',
      details: 'Yaoundé, Cameroun',
      subtitle: 'Siège social'
    }
  ]

  const departments = [
    {
      name: 'Support Client',
      email: 'support@terrabia.com',
      description: 'Pour toute question sur vos commandes'
    },
    {
      name: 'Partenariats',
      email: 'partenariats@terrabia.com',
      description: 'Devenez agriculteur partenaire'
    },
    {
      name: 'Service Livraison',
      email: 'livraison@terrabia.com',
      description: 'Questions sur les livraisons'
    },
    {
      name: 'Service Technique',
      email: 'tech@terrabia.com',
      description: 'Problèmes techniques'
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(45deg, #3a9a3a, #2a7a2a)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Contactez-Nous
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
          Nous sommes là pour vous aider ! N'hésitez pas à nous contacter.
        </Typography>
        <Chip 
          icon={<ScheduleIcon />}
          label="Support disponible 7j/7" 
          color="primary" 
          variant="outlined"
          sx={{ fontSize: '1rem', padding: 1 }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Formulaire de contact */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Envoyez-nous un message
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
            </Typography>

            {submitted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Merci ! Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 heures.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Votre nom complet"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Votre email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sujet"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Votre message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={6}
                    variant="outlined"
                    placeholder="Décrivez-nous votre demande en détail..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SendIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #3a9a3a, #2a7a2a)',
                      padding: '12px 40px',
                      fontSize: '1.1rem'
                    }}
                  >
                    Envoyer le message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Départements */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Contact par Département
            </Typography>
            <Grid container spacing={2}>
              {departments.map((dept, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {dept.name}
                      </Typography>
                      <Typography variant="body2" color="primary" gutterBottom>
                        {dept.email}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {dept.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Informations de contact */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Informations de Contact
            </Typography>
            <List>
              {contactInfo.map((info, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {info.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={info.title}
                    secondary={
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {info.details}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {info.subtitle}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Réseaux sociaux */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Suivez-nous
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<FacebookIcon />}
                sx={{ flex: 1, minWidth: 120 }}
              >
                Facebook
              </Button>
              <Button
                variant="outlined"
                startIcon={<TwitterIcon />}
                sx={{ flex: 1, minWidth: 120 }}
              >
                Twitter
              </Button>
              <Button
                variant="outlined"
                startIcon={<InstagramIcon />}
                sx={{ flex: 1, minWidth: 120 }}
              >
                Instagram
              </Button>
              <Button
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                sx={{ flex: 1, minWidth: 120 }}
              >
                WhatsApp
              </Button>
            </Box>
          </Paper>

          {/* FAQ rapide */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Questions Fréquentes
            </Typography>
            <List dense>
              <ListItem>
                <Typography variant="body2">
                  <strong>Q:</strong> Comment créer un compte agriculteur ?
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body2">
                  <strong>R:</strong> Allez dans "Inscription" et sélectionnez "Agriculteur"
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body2">
                  <strong>Q:</strong> Quelles zones de livraison ?
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body2">
                  <strong>R:</strong> Nous livrons dans tout le Cameroun
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body2">
                  <strong>Q:</strong> Paiements acceptés ?
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body2">
                  <strong>R:</strong> Orange Money, MTN Money, PayPal, Cartes
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Carte de localisation */}
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Notre Localisation
        </Typography>
        <Box
          sx={{
            height: 300,
            background: 'linear-gradient(45deg, #e9ecef, #f8f9fa)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary'
          }}
        >
          <Box textAlign="center">
            <LocationOnIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6">
              Yaoundé, Cameroun
            </Typography>
            <Typography variant="body2">
              Avenue Kennedy, Immeuble TERRABIA
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default Contact