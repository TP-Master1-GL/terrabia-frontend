import React from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Chip
} from '@mui/material'
import { 
  LocalFloristIcon, 
  EcoIcon, 
  PublicIcon, 
  GroupIcon, 
  TrendingUpIcon, 
  SecurityIcon 
} from '../utils/icons'
const About = () => {
  const teamMembers = [
    {
      name: 'NGUEMBU JOHN',
      role: 'Fondateur & CEO',
      description: 'Expert en Developpement logicielle ',
      avatar: '/john.jpeg'
    },
    {
      name: 'Marie Lambert',
      role: 'Responsable Relations Agriculteurs',
      description: 'Spécialiste des filières agricoles locales',
      avatar: '/team/marie.jpg'
    },
    {
      name: 'Pierre Ngo',
      role: 'Directeur Technologique',
      description: 'Développeur full-stack passionné par l\'innovation',
      avatar: '/team/pierre.jpg'
    }
  ]

  const values = [
    {
      icon: <EcoIcon sx={{ fontSize: 40 }} />,
      title: 'Durabilité',
      description: 'Nous promouvons une agriculture respectueuse de l\'environnement et des pratiques durables.'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: 'Communauté',
      description: 'Nous créons des liens forts entre agriculteurs et consommateurs locaux.'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Innovation',
      description: 'Nous utilisons la technologie pour moderniser le secteur agricole africain.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Transparence',
      description: 'Nous garantissons la traçabilité et la qualité de tous nos produits.'
    }
  ]

  const stats = [
    { number: '500+', label: 'Agriculteurs partenaires' },
    { number: '10,000+', label: 'Clients satisfaits' },
    { number: '50+', label: 'Villes couvertes' },
    { number: '95%', label: 'Taux de satisfaction' }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 8 }}>
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
          À Propos de TERRABIA
        </Typography>
        <Typography variant="h5" color="textSecondary" sx={{ mb: 4 }}>
          Révolutionner l'agriculture africaine, un produit à la fois
        </Typography>
        <Chip 
          icon={<LocalFloristIcon />} 
          label="Depuis 2024" 
          color="primary" 
          variant="outlined"
          sx={{ fontSize: '1.1rem', padding: 2 }}
        />
      </Box>

      {/* Mission Section */}
      <Paper sx={{ p: 6, mb: 8, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Notre Mission
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph>
              Connecter directement les agriculteurs locaux aux consommateurs, en éliminant les intermédiaires et en garantissant des prix équitables.
            </Typography>
            <Typography variant="body1" paragraph>
              Chez TERRABIA, nous croyons en une agriculture durable et responsable. Notre plateforme permet aux agriculteurs camerounais et africains de vendre leurs produits frais directement aux consommateurs, tout en offrant à ces derniers un accès facile à des produits locaux de qualité.
            </Typography>
            <Typography variant="body1">
              Nous nous engageons à soutenir l'économie locale, à réduire le gaspillage alimentaire et à promouvoir des pratiques agricoles respectueuses de l'environnement.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                height: 300,
                background: 'linear-gradient(45deg, #3a9a3a, #2a7a2a)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <PublicIcon sx={{ fontSize: 100, opacity: 0.8 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Notre Impact en Chiffres
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Typography variant="h3" component="div" color="primary" fontWeight="bold">
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Values */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Nos Valeurs
        </Typography>
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {value.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    {value.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Notre Équipe
        </Typography>
        <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mb: 4 }}>
          Des passionnés dévoués à la transformation du secteur agricole
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <CardContent>
                  <Avatar
                    src={member.avatar}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      margin: '0 auto 16px',
                      border: '4px solid',
                      borderColor: 'primary.main'
                    }}
                  />
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    {member.name}
                  </Typography>
                  <Chip 
                    label={member.role} 
                    color="primary" 
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {member.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Vision Section */}
      <Paper sx={{ p: 6, background: 'linear-gradient(135deg, #2a7a2a 0%, #1a411a 100%)', color: 'white' }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Notre Vision
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ mb: 3, opacity: 0.9 }}>
          Devenir la plateforme de référence pour l'agriculture durable en Afrique
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ opacity: 0.8, maxWidth: 800, margin: '0 auto' }}>
          Nous aspirons à créer un écosystème agricole prospère où chaque agriculteur peut vivre dignement de son travail, 
          où chaque consommateur a accès à des produits frais et sains, et où les communautés locales sont renforcées 
          grâce à une économie circulaire vertueuse.
        </Typography>
      </Paper>
    </Container>
  )
}

export default About