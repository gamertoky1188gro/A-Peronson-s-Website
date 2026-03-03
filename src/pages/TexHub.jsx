import React from 'react'
import { Link } from 'react-router-dom'

export default function TexHub() {
  return (
    <div className="bg-white neo-panel cyberpunk-card">

            {/* Landing content starts below global navigation */}


      {/* 2. HERO SECTION */}
      <header className="bg-white neo-panel cyberpunk-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Where Global Buyers Meet Verified Garment & Textile Suppliers</h1>
              <p className="mt-4 text-gray-600">A professional B2B platform built exclusively for the garments and textile industry.</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/signup" className="px-6 py-3 bg-[#0A66C2] text-white rounded-lg hover:bg-[#083B75]">Create Buyer Account</Link>
                <Link to="/signup" className="px-6 py-3 border border-[#0A66C2] text-[#0A66C2] rounded-lg hover:bg-[#F4F9FF]">Register Factory</Link>
                <Link to="/feed" className="px-4 py-2 text-gray-700 rounded-lg bg-gray-50 neo-panel cyberpunk-card hover:bg-gray-100">Explore Platform</Link>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2"><span className="w-2 h-2 bg-blue-500 rounded-full"/>Structured Buyer Requests</div>
                <div className="flex items-center space-x-2"><span className="w-2 h-2 bg-blue-500 rounded-full"/>Verified Factories</div>
                <div className="flex items-center space-x-2"><span className="w-2 h-2 bg-blue-500 rounded-full"/>Digital Contract Vault</div>
                <div className="flex items-center space-x-2"><span className="w-2 h-2 bg-blue-500 rounded-full"/>AI Guided Workflow</div>
              </div>
            </div>

            <div>
              {/* Simple dashboard mockup preview */}
              <div className="bg-gray-50 neo-panel cyberpunk-card border rounded-xl p-6 shadow-sm">
                <div className="h-48 bg-white neo-panel cyberpunk-card rounded-md shadow-inner p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-6 w-32 bg-gray-100 rounded" />
                    <div className="h-6 w-16 bg-gray-100 rounded" />
                  </div>
                  <div className="flex-1 overflow-auto">
                    <div className="space-y-3">
                      <div className="h-12 bg-gray-100 rounded" />
                      <div className="h-12 bg-gray-100 rounded" />
                      <div className="h-12 bg-gray-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. PROBLEM & SOLUTION SECTION */}
      <section id="about" className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Problem</h3>
              <ul className="mt-4 list-disc list-inside text-gray-700 space-y-2">
                <li>Random marketplaces are noisy</li>
                <li>No structured buyer requirements</li>
                <li>Too many unverified suppliers</li>
                <li>Internal team conflict in buying houses</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Solution</h3>
              <ul className="mt-4 list-disc list-inside text-gray-700 space-y-2">
                <li>Structured Buyer Requests</li>
                <li>Verified Supplier Priority</li>
                <li>Internal Agent Lock System</li>
                <li>Organized Partner Network</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW GARTEXHUB WORKS (3 STEPS) */}
      <section id="how-it-works" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center">How GarTexHub Works</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg text-center">
              <h4 className="font-bold">1. Post or Search</h4>
              <p className="mt-2 text-sm text-gray-600">Buyer posts structured requirement, Factory posts product.</p>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <h4 className="font-bold">2. Smart Matching & Take Lead</h4>
              <p className="mt-2 text-sm text-gray-600">Buying house agent claims request and AI provides a summary.</p>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <h4 className="font-bold">3. Chat, Call, Contract</h4>
              <p className="mt-2 text-sm text-gray-600">Schedule meetings, sign digital agreements, store in Legal Vault.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PLATFORM FEATURES GRID (4x2) */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-center">Platform Features</h3>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Feature title="Professional Feed" desc="LinkedIn-style professional feed." />
            <Feature title="Unique Toggle" desc="Diverse content mode with unique toggle." />
            <Feature title="Partner Network" desc="Structured partner network system." />
            <Feature title="Multi-Agent Accounts" desc="Multi-agent buying house accounts." />
            <Feature title="Video Gallery" desc="Factory profile video gallery." />
            <Feature title="Enterprise Analytics" desc="Powerful enterprise analytics dashboard." />
            <Feature title="Contract Vault" desc="Secure digital contract vault." />
            <Feature title="AI Assistant" desc="Floating AI assistant for onboarding." />
          </div>
        </div>
      </section>

      {/* 6. ACCOUNT TYPES SECTION */}
      <section className="py-12 bg-gray-50 neo-panel cyberpunk-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-center">Account Types</h3>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white neo-panel cyberpunk-card rounded-lg border">
              <h4 className="font-bold">Buyer</h4>
              <ul className="mt-3 text-sm text-gray-700 list-disc list-inside space-y-2">
                <li>Company-based</li>
                <li>Direct buyer</li>
                <li>Structured requests</li>
                <li>Smart notifications</li>
              </ul>
            </div>
            <div className="p-6 bg-white neo-panel cyberpunk-card rounded-lg border">
              <h4 className="font-bold">Factory</h4>
              <ul className="mt-3 text-sm text-gray-700 list-disc list-inside space-y-2">
                <li>Product management</li>
                <li>Video gallery</li>
                <li>Verified badge</li>
                <li>Direct communication</li>
              </ul>
            </div>
            <div className="p-6 bg-white neo-panel cyberpunk-card rounded-lg border">
              <h4 className="font-bold">Buying House</h4>
              <ul className="mt-3 text-sm text-gray-700 list-disc list-inside space-y-2">
                <li>Multi-agent access</li>
                <li>Partner network</li>
                <li>Lead claiming system</li>
                <li>Enterprise analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ENTERPRISE SECTION */}
      <section className="py-12 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold">Built for Growing Buying Houses</h3>
          <p className="mt-3">Unlimited Sub Accounts · Dedicated Analytics · Organization Control · Contract Management</p>
          <div className="mt-6">
            <button className="px-6 py-3 bg-white neo-panel cyberpunk-card text-blue-700 rounded-lg font-bold">View Enterprise Plans</button>
          </div>
        </div>
      </section>

      {/* 8. TRUST & PROFESSIONALISM SECTION */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold">Focused only on Garments & Textile Industry</h3>
          <p className="mt-4 text-gray-600">Industry categories:</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-gray-700">
            <span className="px-3 py-1 bg-gray-100 rounded">Shirts</span>
            <span className="px-3 py-1 bg-gray-100 rounded">Pants</span>
            <span className="px-3 py-1 bg-gray-100 rounded">Knitwear</span>
            <span className="px-3 py-1 bg-gray-100 rounded">Woven</span>
            <span className="px-3 py-1 bg-gray-100 rounded">Denim</span>
            <span className="px-3 py-1 bg-gray-100 rounded">Custom Production</span>
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION SECTION */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold">Start Connecting with the Right Partners</h2>
          <div className="mt-6 flex justify-center gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded">Create Account</button>
            <button className="px-6 py-3 bg-white neo-panel cyberpunk-card border border-gray-300 rounded">Login</button>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-white neo-panel cyberpunk-card border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 flex items-center justify-center rounded">GT</div>
              <div>
                <div className="font-bold text-lg">GAR TEX HUB</div>
                <div className="text-sm text-gray-600">Professional B2B sourcing for garments & textiles.</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#about" className="hover:text-blue-700">About</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-700">How It Works</a></li>
              <li><a href="/pricing" className="hover:text-blue-700">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-700">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-700">Terms & Conditions</a></li>
            </ul>
          </div>

          <div className="text-right text-sm text-gray-700">
            <div>Contact: support@gartexhub.example</div>
            <div className="mt-2">Help Center</div>
          </div>
        </div>

        <div className="border-t py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            © 2026 GarTexHub. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  )
}

function Feature({ title, desc }){
  return (
    <div className="p-4 border rounded-lg bg-white neo-panel cyberpunk-card">
      <div className="h-10 w-10 bg-blue-50 rounded flex items-center justify-center mb-3">✓</div>
      <h4 className="font-bold">{title}</h4>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
    </div>
  )
}
