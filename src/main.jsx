import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient()

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E992EFF',
      light: '#5cb55c',
      dark: '#2a7a2a',
    },
    secondary: {
      main: '#f38c1c',
      light: '#f7b155',
      dark: '#e46c12',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
})

// Initialiser les données de test
const initializeTestData = () => {
  // Vérifier si les données de test existent déjà
  if (!localStorage.getItem('terrabia_test_data_initialized')) {
    const testUsers = [
      {
        id: 1,
        name: 'Administrateur TERRABIA',
        email: 'admin@terrabia.com',
        role: 'admin',
        phone: '+237 6 54 32 10 98',
        address: 'Yaoundé, Cameroun'
      },
      {
        id: 2,
        name: 'Agriculteur Test',
        email: 'farmer@test.com',
        role: 'farmer',
        phone: '+237 6 54 32 10 99',
        address: 'Douala, Cameroun',
        farm_name: 'Ferme Test'
      },
      {
        id: 3,
        name: 'Client Test',
        email: 'customer@test.com',
        role: 'customer',
        phone: '+237 6 54 32 10 97',
        address: 'Yaoundé, Cameroun'
      },
      {
        id: 4,
        name: 'Express Delivery Cameroun',
        email: 'delivery@test.com',
        role: 'delivery',
        phone: '+237 6 54 32 10 00',
        address: 'Yaoundé, Cameroun'
      }
    ]

    // Initialiser les produits de test
    const testProducts = [
      {
        id: 1,
        name: 'Tomates Fraîches',
        category: 'Légumes',
        price: 1200,
        quantity: 50,
        unit: 'kg',
        description: 'Tomates rouges et juteuses cultivées localement, riches en vitamines et antioxydants. Parfaites pour vos salades et sauces.',
        images: ['/placeholder-product.jpg'],
        farmer: { name: 'Jean Dupont', id: 5 },
        rating: 4.5,
        review_count: 24,
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Bananes Plantains',
        category: 'Fruits',
        price: 800,
        quantity: 30,
        unit: 'kg',
        description: 'Bananes plantains mûres à point, idéales pour la cuisson. Produites dans nos plantations biologiques.',
        images: ['/placeholder-product.jpg'],
        farmer: { name: 'Marie Lambert', id: 6 },
        rating: 4.2,
        review_count: 18,
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Oignons Locaux',
        category: 'Légumes',
        price: 600,
        quantity: 100,
        unit: 'kg',
        description: 'Oignons frais et parfumés, récoltés manuellement. Conservation excellente.',
        images: ['/placeholder-product.jpg'],
        farmer: { name: 'Pierre Ngo', id: 7 },
        rating: 4.7,
        review_count: 32,
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Piments Frais',
        category: 'Épices',
        price: 300,
        quantity: 25,
        unit: 'kg',
        description: 'Piments frais et piquants, parfaits pour relever vos plats. Différents niveaux de force disponibles.',
        images: ['/placeholder-product.jpg'],
        farmer: { name: 'Alice Mbarga', id: 8 },
        rating: 4.3,
        review_count: 15,
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Aubergines Africaines',
        category: 'Légumes',
        price: 700,
        quantity: 40,
        unit: 'kg',
        description: 'Aubergines fraîches et fermes, excellentes pour les ragoûts et plats traditionnels.',
        images: ['/placeholder-product.jpg'],
        farmer: { name: 'David Fokou', id: 9 },
        rating: 4.6,
        review_count: 21,
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        id: 6,
        name: 'Manioc',
        category: 'Tubercules',
        price: 400,
        quantity: 80,
        unit: 'kg',
        description: 'Manioc frais de première qualité, parfait pour le bâton de manioc ou la farine.',
        images: ['/placeholder-product.jpg'],
        farmer: { name: 'Sophie Kana', id: 10 },
        rating: 4.4,
        review_count: 28,
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        id: 7,
        name: 'Carottes Fraîches',
        category: 'Légumes',
        price: 900,
        quantity: 35,
        unit: 'kg',
        description: 'Carottes croquantes et sucrées, riches en bêta-carotène. Idéales pour les jus et salades.',
        images: ['/placeholder-product.jpg'],
        farmer: { name: 'Paul Ndi', id: 11 },
        rating: 4.8,
        review_count: 19,
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        id: 8,
        name: 'Ananas Mûrs',
        category: 'Fruits',
        price: 1500,
        quantity: 20,
        unit: 'pièce',
        description: 'Ananas sucrés et juteux, cueillis à maturité. Parfaits pour les desserts et jus naturels.',
        images: ['/placeholder-product.jpg'],
        farmer: { name: 'Julie Mbappe', id: 12 },
        rating: 4.9,
        review_count: 27,
        is_available: true,
        created_at: new Date().toISOString()
      }
    ]

    // Initialiser les commandes de test
    const testOrders = [
      {
        id: 1,
        customer_id: 3,
        farmer_id: 2,
        total: 8500,
        status: 'confirmed',
        items: [
          { product_id: 1, quantity: 2, price: 1200 },
          { product_id: 3, quantity: 1, price: 600 }
        ],
        created_at: '2024-01-20T10:00:00Z',
        customer: { name: 'Client Test' },
        farmer: { name: 'Agriculteur Test' }
      }
    ]

    // Initialiser les entreprises de livraison
    const testDeliveryCompanies = [
      {
        id: 1,
        name: 'Express Delivery Cameroun',
        email: 'delivery@test.com',
        phone: '+237 6 54 32 10 00',
        address: 'Yaoundé, Cameroun',
        status: 'active',
        created_at: '2024-01-15',
        password: 'delivery123'
      },
      {
        id: 2,
        name: 'Rapid Livraison',
        email: 'rapid@livraison.cm',
        phone: '+237 6 54 32 10 01',
        address: 'Douala, Cameroun',
        status: 'active',
        created_at: '2024-01-20',
        password: 'rapid123'
      }
    ]

    // Initialiser les données de livraison
    const testDeliveries = [
      {
        id: 1,
        order_id: 1001,
        customer: 'Client Test',
        address: 'Yaoundé, Cameroun',
        status: 'pending',
        created_at: '2024-01-20 10:00',
        items: ['Tomates (2kg)', 'Oignons (1kg)'],
        delivery_company_id: 1
      },
      {
        id: 2,
        order_id: 1002,
        customer: 'Marie Lambert',
        address: 'Douala, Cameroun',
        status: 'accepted',
        created_at: '2024-01-20 09:30',
        items: ['Bananes (3kg)'],
        delivery_company_id: 1
      }
    ]
    
    localStorage.setItem('terrabia_users', JSON.stringify(testUsers))
    localStorage.setItem('terrabia_products', JSON.stringify(testProducts))
    localStorage.setItem('terrabia_orders', JSON.stringify(testOrders))
    localStorage.setItem('terrabia_delivery_companies', JSON.stringify(testDeliveryCompanies))
    localStorage.setItem('terrabia_deliveries', JSON.stringify(testDeliveries))
    localStorage.setItem('terrabia_test_data_initialized', 'true')
    
    console.log('✅ Données de test initialisées avec succès!')
    console.log('👑 Compte Admin: admin@terrabia.com / admin123')
    console.log('👨‍🌾 Compte Agriculteur: farmer@test.com / farmer123')
    console.log('🛒 Compte Client: customer@test.com / customer123')
    console.log('🚚 Compte Livreur: delivery@test.com / delivery123')
    console.log('')
    console.log('📦 Produits de test: 8 produits disponibles')
    console.log('🏢 Entreprises de livraison: 2 entreprises créées')
    console.log('📮 Livraisons: 2 livraisons en attente')
  }
}

// Appeler l'initialisation au démarrage
initializeTestData()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)