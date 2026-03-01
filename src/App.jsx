import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TexHub from './pages/TexHub'
import Pricing from './pages/Pricing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import MainFeed from './pages/MainFeed'
import SearchResults from './pages/SearchResults'
import BuyerProfile from './pages/BuyerProfile'
import FactoryProfile from './pages/FactoryProfile'
import BuyingHouseProfile from './pages/BuyingHouseProfile'
import OwnerDashboard from './pages/OwnerDashboard'
import AgentDashboard from './pages/AgentDashboard'
import MemberManagement from './pages/MemberManagement'
import PartnerNetwork from './pages/PartnerNetwork'
import ProductManagement from './pages/ProductManagement'
import BuyerRequestManagement from './pages/BuyerRequestManagement'
import ChatInterface from './pages/ChatInterface'
import CallInterface from './pages/CallInterface'
import HelpCenter from './pages/HelpCenter'
import ContractVault from './pages/ContractVault'
import NotificationsCenter from './pages/NotificationsCenter'
import OrgSettings from './pages/OrgSettings'
import Insights from './pages/Insights'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import NavBar from './components/NavBar'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<TexHub />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<MainFeed />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/buyer/:id" element={<BuyerProfile />} />
        <Route path="/factory/:id" element={<FactoryProfile />} />
        <Route path="/buying-house/:id" element={<BuyingHouseProfile />} />
        <Route path="/member-management" element={<MemberManagement />} />
        <Route path="/partner-network" element={<PartnerNetwork />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route path="/buyer-requests" element={<BuyerRequestManagement />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contracts" element={<ContractVault />} />
        <Route path="/notifications" element={<NotificationsCenter />} />
        <Route path="/org-settings" element={<OrgSettings />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/call" element={<CallInterface />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/agent" element={<AgentDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App