import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import GavelIcon from '@mui/icons-material/Gavel'
import SecurityIcon from '@mui/icons-material/Security'
import PaymentIcon from '@mui/icons-material/Payment'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PersonIcon from '@mui/icons-material/Person'

const Terms = () => {
  const [expanded, setExpanded] = useState('panel1')

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  const sections = [
    {
      id: 'panel1',
      title: 'Acceptation des Conditions',
      icon: <CheckCircleIcon />,
      content: `En accédant et en utilisant la plateforme TERRABIA, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.`
    },
    {
      id: 'panel2',
      title: 'Compte Utilisateur',
      icon: <PersonIcon />,
      content: `Pour utiliser certaines fonctionnalités de TERRABIA, vous devez créer un compte. Vous êtes responsable de :
      - Maintenir la confidentialité de vos identifiants
      - Toutes les activités sur votre compte
      - Fournir des informations exactes et à jour
      
      TERRABIA se réserve le droit de suspendre ou de résilier les comptes qui violent ces conditions.`
    },
    {
      id: 'panel3',
      title: 'Achats et Paiements',
      icon: <PaymentIcon />,
      content: `Les prix des produits sont indiqués en FCFA et incluent toutes les taxes applicables.
      
      Modes de paiement acceptés :
      - Orange Money
      - MTN Money
      - PayPal
      - Carte bancaire
      
      Les paiements sont sécurisés via notre partenaire de paiement. TERRABIA ne stocke pas vos informations de carte bancaire.`
    },
    {
      id: 'panel4',
      title: 'Livraison',
      icon: <LocalShippingIcon />,
      content: `Les délais de livraison varient selon votre localisation :
      - Yaoundé : 24-48 heures
      - Douala : 48-72 heures
      - Autres villes : 3-5 jours
      
      Les frais de livraison sont calculés en fonction de la distance et du poids de la commande.
      
      En cas d'absence, le livreur tentera une nouvelle livraison le lendemain.`
    },
    {
      id: 'panel5',
      title: 'Retours et Remboursements',
      icon: <GavelIcon />,
      content: `Vous pouvez demander un retour sous les conditions suivantes :
      - Produit endommagé à la réception : 24 heures
      - Produit non conforme : 48 heures
      - Erreur de commande : 24 heures
      
      Les produits périssables ne peuvent être retournés sauf en cas de non-conformité.
      
      Les remboursements sont traités dans un délai de 7 jours ouvrables.`
    },
    {
      id: 'panel6',
      title: 'Propriété Intellectuelle',
      icon: <SecurityIcon />,
      content: `Le contenu de la plateforme TERRABIA (logos, textes, images, design) est protégé par le droit d'auteur.
      
      Vous pouvez :
      - Utiliser la plateforme pour vos achats personnels
      - Partager les produits sur les réseaux sociaux
      
      Vous ne pouvez pas :
      - Copier ou reproduire le contenu sans autorisation
      - Utiliser les données à des fins commerciales
      - Reverse engineer la plateforme`
    },
    {
      id: 'panel7',
      title: 'Responsabilités',
      icon: <GavelIcon />,
      content: `TERRABIA s'engage à :
      - Fournir une plateforme fonctionnelle et sécurisée
      - Faciliter les transactions entre agriculteurs et clients
      - Protéger vos données personnelles
      
      Limitations de responsabilité :
      - TERRABIA n'est pas responsable de la qualité des produits vendus par les agriculteurs
      - Les retards de livraison dus à des circonstances indépendantes de notre volonté
      - Les variations de prix décidées par les agriculteurs`
    },
    {
      id: 'panel8',
      title: 'Modifications des Conditions',
      icon: <CheckCircleIcon />,
      content: `TERRABIA se réserve le droit de modifier ces conditions d'utilisation à tout moment. Les modifications prendront effet dès leur publication sur la plateforme.
      
      Il est de votre responsabilité de consulter régulièrement les conditions d'utilisation. Votre utilisation continue de la plateforme après toute modification constitue votre acceptation des nouvelles conditions.`
    }
  ]

  const quickFacts = [
    '✅ Paiements 100% sécurisés',
    '✅ Livraison partout au Cameroun',
    '✅ Support client 7j/7',
    '✅ Retours sous 48h',
    '✅ Données protégées',
    '✅ Prix transparents'
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
          Conditions d'Utilisation
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
          Dernière mise à jour : 1er Janvier 2024
        </Typography>
        <Chip 
          label="Document légal" 
          color="primary" 
          variant="outlined"
          sx={{ fontSize: '1rem', padding: 1 }}
        />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Introduction */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Bienvenue sur TERRABIA
            </Typography>
            <Typography variant="body1" paragraph>
              Les présentes conditions d'utilisation régissent votre utilisation de la plateforme TERRABIA et de tous ses services associés. En utilisant notre plateforme, vous acceptez d'être lié par ces conditions.
            </Typography>
            <Typography variant="body1">
              Nous vous recommandons de lire attentivement ce document avant d'utiliser nos services.
            </Typography>
          </Paper>

          {/* Accordions pour les sections */}
          {sections.map((section) => (
            <Accordion 
              key={section.id}
              expanded={expanded === section.id}
              onChange={handleChange(section.id)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {section.title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {section.content}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Contact pour questions légales */}
          <Paper sx={{ p: 4, mt: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Questions Légales ?
            </Typography>
            <Typography variant="body1">
              Si vous avez des questions concernant ces conditions d'utilisation, veuillez nous contacter à :
            </Typography>
            <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
              📧 legal@terrabia.com
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              📞 +237 6 54 32 10 00
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Sidebar avec infos rapides */}
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              En Bref
            </Typography>
            <List>
              {quickFacts.map((fact, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={fact} />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 3, p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                ⚠️ Important
              </Typography>
              <Typography variant="body2">
                En utilisant TERRABIA, vous certifiez avoir au moins 18 ans ou avoir l'autorisation parentale.
              </Typography>
            </Box>

            <Box sx={{ mt: 2, p: 2, backgroundColor: 'warning.light', borderRadius: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                📝 À Savoir
              </Typography>
              <Typography variant="body2">
                Conservez une copie de ces conditions pour référence future.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Terms