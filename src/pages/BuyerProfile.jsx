import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'


const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function starsFromAverage(avg) {
  const rounded = Math.round(Number(avg || 0))
  return '★★★★★'.slice(0, rounded).padEnd(5, '☆')
}

export default function BuyerProfile() {
  const [ratingSummary, setRatingSummary] = useState(null)

  useEffect(() => {
    fetch(`${API}/ratings/profiles/buyer:global-apparel-co`)
      .then((res) => res.json())
      .then((data) => setRatingSummary(data))
      .catch(() => setRatingSummary(null))
  }, [])

  const buyer = {
    name: 'Global Apparel Co',
    verified: true,
    location: 'Dhaka, Bangladesh',
    industry: 'Garments',
    orgType: 'Direct Buyer',
    about:
      'Global Apparel Co sources seasonal collections for retail chains. We focus on dependable suppliers with strong QA and ethical practices.',
    tags: ['Knits', 'Woven', 'Embroidery'],
    orderVolume: '500-5000 units per order',
    fabrics: ['Cotton', 'Poly-cotton', 'Denim'],
    certifications: ['BSCI', 'OEKO-TEX'],
  }

  const requests = [
    {
      id: 1,
      title: 'White cotton tees with custom print',
      summary: 'Need 2-color chest print, soft combed cotton, stable sizing',
      budget: '$1.50 - $2.10 / unit',
      deadline: '2026-03-30',
      status: 'Open',
    },
    {
      id: 2,
      title: 'Denim jeans - slim fit',
      summary: 'Midweight denim, stone wash finish, 6-pocket styling',
      budget: '$8 - $12 / unit',
      deadline: '2026-04-15',
      status: 'In Progress',
    },
  ]

  const pastDeals = {
    completed: 24,
    successRate: '92%',
  }

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      {/* TOP NAVIGATION */}
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto p-6">


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-1 sticky top-6 self-start">
            <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg">{buyer.name}</h2>
                    {buyer.verified && (
                      <div className="flex items-center gap-1 bg-[#E8F3FF] text-[#0A66C2] px-2 py-0.5 rounded-full text-sm font-semibold">
                        <span className="w-5 h-5 bg-[#0A66C2] text-white rounded-full flex items-center justify-center">✓</span>
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-[#5A5A5A]">{buyer.location}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-[#5A5A5A]">
                <div>Industry: <strong className="text-[#1A1A1A]">{buyer.industry}</strong></div>
                <div>Organization: <strong className="text-[#1A1A1A]">{buyer.orgType}</strong></div>
                <div>Rating: <strong className="text-[#1A1A1A]">{ratingSummary?.aggregate?.average_score || '0.0'} / 5</strong></div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-[#0A66C2] text-white py-2 rounded-xl">Contact</button>
                <button className="flex-1 border border-gray-200 py-2 rounded-xl">Follow</button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-2 space-y-6">
            <section className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-2">About {buyer.name}</h3>
              <p className="text-[#5A5A5A] mb-3">{buyer.about}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {buyer.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[#F4F9FF] rounded-full text-sm text-[#0A66C2]">{tag}</span>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm text-[#5A5A5A]">
                <div>
                  <div className="text-xs text-[#5A5A5A]">Typical Order Volume</div>
                  <div className="font-medium text-[#1A1A1A]">{buyer.orderVolume}</div>
                </div>
                <div>
                  <div className="text-xs text-[#5A5A5A]">Preferred Fabrics</div>
                  <div className="font-medium text-[#1A1A1A]">{buyer.fabrics.join(', ')}</div>
                </div>
                <div>
                  <div className="text-xs text-[#5A5A5A]">Certifications Required</div>
                  <div className="font-medium text-[#1A1A1A]">{buyer.certifications.join(', ')}</div>
                </div>
              </div>
            </section>

            <section className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Active Buyer Requests</h3>
              <div className="space-y-4">
                {requests.map(r => (
                  <div key={r.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{r.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${r.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {r.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#5A5A5A] mt-1">{r.summary}</p>
                        <div className="text-sm text-[#5A5A5A] mt-2">Budget: <strong className="text-[#1A1A1A]">{r.budget}</strong></div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="text-sm text-[#5A5A5A]">Deadline: <strong className="text-[#1A1A1A]">{r.deadline}</strong></div>
                        <Link to={`/buyer/requests/${r.id}`} className="bg-[#0A66C2] text-white px-4 py-2 rounded-lg hover:bg-[#083B75]">View Details</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">Past Deals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-[#F4F9FF] rounded-lg">
                  <div className="text-xs text-[#5A5A5A]">Completed Contracts</div>
                  <div className="font-semibold text-[#1A1A1A] text-xl">{pastDeals.completed}</div>
                </div>
                <div className="p-4 bg-[#F4F9FF] rounded-lg">
                  <div className="text-xs text-[#5A5A5A]">Success Rate</div>
                  <div className="font-semibold text-[#1A1A1A] text-xl">{pastDeals.successRate}</div>
                </div>
                <div className="p-4 bg-[#F4F9FF] rounded-lg">
                  <div className="text-xs text-[#5A5A5A]">Top Reviews</div>
                  <div className="text-sm text-[#1A1A1A] mt-2">{(ratingSummary?.recent_reviews || []).slice(0, 2).map((r) => r.comment).filter(Boolean).join(' • ') || 'No reviews yet'}</div>
                </div>
              </div>
            </section>

            <section className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">Reviews</h3>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-[#0A66C2]">{ratingSummary?.aggregate?.average_score || '0.0'}</span>
                  <div>
                    <div className="text-lg">{starsFromAverage(ratingSummary?.aggregate?.average_score)}</div>
                    <div className="text-sm text-[#5A5A5A]">{ratingSummary?.aggregate?.total_count || 0} reviews</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs text-[#5A5A5A]
              ">
                <div className="p-3 bg-[#F4F9FF] rounded-lg">Recent Avg: <strong>{ratingSummary?.aggregate?.recent_average_score || '0.0'}</strong></div>
                <div className="p-3 bg-[#F4F9FF] rounded-lg">Reliability: <strong className="uppercase">{ratingSummary?.aggregate?.reliability?.confidence || 'low'}</strong></div>
                <div className="p-3 bg-[#F4F9FF] rounded-lg">Qualified Ratings: <strong>{Math.round((ratingSummary?.aggregate?.reliability?.qualified_interaction_ratio || 0) * 100)}%</strong></div>
              </div>

              <div className="text-xs text-[#5A5A5A] mb-3">Breakdown: 5★ {ratingSummary?.breakdown?.[5] || 0} • 4★ {ratingSummary?.breakdown?.[4] || 0} • 3★ {ratingSummary?.breakdown?.[3] || 0} • 2★ {ratingSummary?.breakdown?.[2] || 0} • 1★ {ratingSummary?.breakdown?.[1] || 0}</div>
              <div className="space-y-3">
                {(ratingSummary?.recent_reviews || []).map((r) => (
                  <div key={r.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-[#1A1A1A]">{r.comment || 'No comment provided.'}</div>
                        <div className="text-xs text-[#5A5A5A] mt-1">— Factory Reviewer • 3 weeks ago</div>
                      </div>
                      <div className="text-sm font-semibold text-[#0A66C2]">{r.score || 0}★</div>
                    </div>
                  </div>
                ))}
                {!ratingSummary?.recent_reviews?.length && (
                  <div className="rounded-lg border border-dashed border-gray-200 p-3 text-sm text-[#5A5A5A]">No reviews available yet.</div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      <FloatingAssistant />
    </div>
  )
}
