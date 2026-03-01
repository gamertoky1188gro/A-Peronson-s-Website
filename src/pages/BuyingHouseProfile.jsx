import React from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function BuyingHouseProfile() {
  const org = {
    name: 'Atlas Buying House',
    verified: true,
    location: 'Ho Chi Minh City, Vietnam',
    years: 12,
    partners: 18,
    about: 'We manage end-to-end sourcing, QC, and shipment for western retailers across multiple categories.',
    markets: ['EU', 'North America', 'AU'],
    services: ['Sourcing', 'Quality Control', 'Full Management'],
  }

  const partners = new Array(6).fill(0).map((_, i) => ({ id: i, name: `Factory ${i + 1}` }))
  const handling = [
    { id: 1, title: 'Sportswear order - 2000 units', status: 'In Progress' },
    { id: 2, title: 'Knit polo - 1200 units', status: 'Sampling' },
  ]

  const metrics = {
    completionRate: '94%',
    avgDealTime: '22 days',
    rating: '4.7',
  }

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      {/* TOP NAVIGATION */}
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <aside className="lg:col-span-1 sticky top-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg">{org.name}</h2>
                    {org.verified && (
                      <div className="flex items-center gap-1 bg-[#E8F3FF] text-[#0A66C2] px-2 py-0.5 rounded-full text-sm font-semibold">
                        <span className="w-5 h-5 bg-[#0A66C2] text-white rounded-full flex items-center justify-center">✓</span>
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-[#5A5A5A]">{org.location}</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-[#5A5A5A] space-y-2">
                <div>Years in operation: <strong className="text-[#1A1A1A]">{org.years}</strong></div>
                <div>Partner Factories: <strong className="text-[#1A1A1A]">{org.partners}</strong></div>
              </div>

              <div className="mt-4">
                <button className="w-full bg-[#0A66C2] text-white py-2 rounded-xl hover:bg-[#083B75]">Contact Organization</button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg">About</h3>
              <p className="text-[#5A5A5A] mt-2">{org.about}</p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#F4F9FF] rounded-lg">
                  <div className="text-xs text-[#5A5A5A]">Markets Served</div>
                  <div className="font-medium">{org.markets.join(', ')}</div>
                </div>
                <div className="p-4 bg-[#F4F9FF] rounded-lg">
                  <div className="text-xs text-[#5A5A5A]">Service Type</div>
                  <div className="font-medium">{org.services.join(', ')}</div>
                </div>
                <div className="p-4 bg-[#F4F9FF] rounded-lg">
                  <div className="text-xs text-[#5A5A5A]">Partner Factories</div>
                  <div className="font-medium">{partners.length}</div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg">Partner Network Preview</h3>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {partners.map(p => (
                  <div key={p.id} className="flex items-center justify-center bg-gray-100 rounded-lg h-20">{p.name}</div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/buying-house/network" className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#083B75]">View Full Network</Link>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg">Active Buyer Requests Handling</h3>
              <div className="space-y-3 mt-3">
                {handling.map(h => (
                  <div key={h.id} className="border border-gray-100 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{h.title}</div>
                      <div className="text-sm text-[#5A5A5A]">Status: {h.status}</div>
                    </div>
                    <div>
                      <button className="px-3 py-1 bg-[#0A66C2] text-white rounded-md">View</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-[#F4F9FF] rounded-lg">
                  <div className="text-xs text-[#5A5A5A]">Completion Rate</div>
                  <div className="font-semibold">{metrics.completionRate}</div>
                </div>
                <div className="p-4 bg-[#F4F9FF] rounded-lg">
                  <div className="text-xs text-[#5A5A5A]">Average Deal Time</div>
                  <div className="font-semibold">{metrics.avgDealTime}</div>
                </div>
                <div className="p-4 bg-[#F4F9FF] rounded-lg">
                  <div className="text-xs text-[#5A5A5A]">Rating Score</div>
                  <div className="font-semibold">{metrics.rating}</div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <FloatingAssistant />
    </div>
  )
}
