import React from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import TexHub from './pages/TexHub'
import Pricing from './pages/Pricing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import SignupUltra from './pages/auth/SignupUltra'
import MainFeed from './pages/MainFeed'
import SearchResults from './pages/SearchResults'
import BuyerProfile from './pages/BuyerProfile'
import FactoryProfile from './pages/FactoryProfile'
import BuyingHouseProfile from './pages/BuyingHouseProfile'
import MemberManagement from './pages/MemberManagement'
import PartnerNetwork from './pages/PartnerNetwork'
import ProductManagement from './pages/ProductManagement'
import BuyerRequestManagement from './pages/BuyerRequestManagement'
import HelpCenter from './pages/HelpCenter'
import ContractVault from './pages/ContractVault'
import NotificationsCenter from './pages/NotificationsCenter'
import OrgSettings from './pages/OrgSettings'
import Insights from './pages/Insights'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ChatInterface from './pages/ChatInterface'
import CallInterface from './pages/CallInterface'
import OwnerDashboard from './pages/OwnerDashboard'
import AgentDashboard from './pages/AgentDashboard'
import MvpDashboard from './pages/MvpDashboard'
import FloatingAssistant from './components/FloatingAssistant'
import Footer from './components/Footer'
import AccessDenied from './pages/AccessDenied'
import VerificationPage from './pages/VerificationPage'
import { getCurrentUser } from './lib/auth'

const AUTH_ROLES = ['buyer', 'buying_house', 'factory', 'owner', 'admin', 'agent']
const OWNER_ONLY_ROLES = ['owner', 'admin']
const MEMBER_MANAGEMENT_ROLES = ['owner', 'admin', 'buying_house', 'factory']

function ProtectedRoute({ children, roles }) {
  const location = useLocation()
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (Array.isArray(roles) && roles.length && !roles.includes(user.role)) {
    return <Navigate to="/access-denied" replace state={{ from: location.pathname }} />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TexHub />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/:time/meow/:date/SignupUltra" element={<SignupUltra />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      <Route path="/feed" element={<ProtectedRoute roles={AUTH_ROLES}><MainFeed /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute roles={AUTH_ROLES}><SearchResults /></ProtectedRoute>} />
      <Route path="/buyer/:id" element={<ProtectedRoute roles={AUTH_ROLES}><BuyerProfile /></ProtectedRoute>} />
      <Route path="/factory/:id" element={<ProtectedRoute roles={AUTH_ROLES}><FactoryProfile /></ProtectedRoute>} />
      <Route path="/buying-house/:id" element={<ProtectedRoute roles={AUTH_ROLES}><BuyingHouseProfile /></ProtectedRoute>} />
      <Route path="/partner-network" element={<ProtectedRoute roles={['buying_house', 'admin', 'factory', 'agent', 'owner']}><PartnerNetwork /></ProtectedRoute>} />
      <Route path="/product-management" element={<ProtectedRoute roles={['factory', 'buying_house', 'admin']}><ProductManagement /></ProtectedRoute>} />
      <Route path="/buyer-requests" element={<ProtectedRoute roles={['buyer', 'buying_house', 'admin']}><BuyerRequestManagement /></ProtectedRoute>} />
      <Route path="/contracts" element={<ProtectedRoute roles={AUTH_ROLES}><ContractVault /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute roles={AUTH_ROLES}><NotificationsCenter /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute roles={AUTH_ROLES}><ChatInterface /></ProtectedRoute>} />
      <Route path="/call" element={<ProtectedRoute roles={AUTH_ROLES}><CallInterface /></ProtectedRoute>} />
      <Route path="/verification" element={<ProtectedRoute roles={AUTH_ROLES}><VerificationPage /></ProtectedRoute>} />
      <Route path="/verification-center" element={<ProtectedRoute roles={AUTH_ROLES}><VerificationPage /></ProtectedRoute>} />

      <Route path="/member-management" element={<ProtectedRoute roles={MEMBER_MANAGEMENT_ROLES}><MemberManagement /></ProtectedRoute>} />
      <Route path="/org-settings" element={<ProtectedRoute roles={OWNER_ONLY_ROLES}><OrgSettings /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute roles={OWNER_ONLY_ROLES}><Insights /></ProtectedRoute>} />
      <Route path="/owner" element={<ProtectedRoute roles={OWNER_ONLY_ROLES}><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/agent" element={<ProtectedRoute roles={['buying_house', 'owner', 'admin', 'agent']}><AgentDashboard /></ProtectedRoute>} />

      <Route path="/mvp" element={<MvpDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AppLayout() {
  const location = useLocation()
  const isChatRoute = location.pathname === '/chat'

  return (
    <div className="app-shell min-h-screen">
      {!isChatRoute ? <NavBar /> : null}
      <main className={isChatRoute ? '' : 'pb-10'}>
        <AppRoutes />
      </main>
      {!isChatRoute ? <Footer /> : null}
      <FloatingAssistant />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
