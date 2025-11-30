// App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/common/Layout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import FarmerDashboard from './pages/farmer/Dashboard'
import CustomerDashboard from './pages/customer/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import Products from './pages/shared/Products'
import Cart from './pages/customer/Cart'
import Orders from './pages/shared/Orders'
import Chat from './pages/shared/Chat'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DeliveryDashboard from './pages/delivery/Dashboard'
import About from './pages/About'
import Terms from './pages/Terms'
import Contact from './pages/Contact'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes sans layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes avec layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          
          {/* Nouvelles pages publiques */}
          <Route path="about" element={<About />} />
          <Route path="terms" element={<Terms />} />
          <Route path="contact" element={<Contact />} />
          
          {/* Routes protégées pour agriculteurs */}
          <Route path="farmer" element={
            <ProtectedRoute allowedRoles={['farmer', 'admin']}>
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Routes protégées pour clients */}
          <Route path="customer" element={
            <ProtectedRoute allowedRoles={['customer', 'buyer', 'admin']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="cart" element={
            <ProtectedRoute allowedRoles={['customer', 'buyer']}>
              <Cart />
            </ProtectedRoute>
          } />
          
          {/* Routes protégées pour admin */}
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Routes protégées pour livreurs */}
          <Route path="delivery" element={
            <ProtectedRoute allowedRoles={['delivery', 'admin']}>
              <DeliveryDashboard />
            </ProtectedRoute>
          } />
          
          {/* Routes partagées */}
          <Route path="orders" element={
            <ProtectedRoute allowedRoles={['farmer', 'customer', 'buyer', 'admin', 'delivery']}>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="chat" element={
            <ProtectedRoute allowedRoles={['farmer', 'customer', 'buyer', 'admin', 'delivery']}>
              <Chat />
            </ProtectedRoute>
          } />
        </Route>

        {/* Redirection pour les routes non trouvées */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthProvider>
  )
}

export default App