import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'


const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function starsFromAverage(avg) {
  const rounded = Math.round(Number(avg || 0))
  return '★★★★★'.slice(0, rounded).padEnd(5, '☆')
}

export default function FactoryProfile() {
  const [activeTab, setActiveTab] = useState('overview')
  const [ratingSummary, setRatingSummary] = useState(null)

  useEffect(() => {
    fetch(`${API}/ratings/profiles/factory:premier-textile-mills`)
      .then((res) => res.json())
      .then((data) => setRatingSummary(data))
      .catch(() => setRatingSummary(null))
  }, [])

  const factory = {
    name: 'Premier Textile Mills',
    verified: true,
    location: 'Tirupur, India',
    capacity: '250,000 units / month',
    employees: 450,
    certifications: ['ISO 9001', 'WRAP'],
    about:
      'Full-package manufacturer specializing in knitwear and woven garments. Strong focus on lead-time adherence and quality control.',
    machinery: ['Flat-bed knitting', 'Overlock', 'Auto cutting', 'Industrial washing'],
    specializations: ['Shirts', 'Knitwear', 'Sportswear'],
    export: ['USA', 'EU', 'Japan'],
  }

  const products = [
    { id: 1, name: 'Pique Polo', category: 'Knitwear', moq: 200 },
    { id: 2, name: 'Heavyweight Hoodie', category: 'Knitwear', moq: 300 },
    { id: 3, name: 'Denim Jacket', category: 'Woven', moq: 400 },
  ]


  const videoGallery = [
    {
      id: 1,
      title: 'Knitting floor walkthrough',
      duration: '2:18',
      reviewStatus: 'approved',
      summary: 'Shows daily output checks and in-line quality control stations.',
    },
    {
      id: 2,
      title: 'Packaging and dispatch line',
      duration: '1:47',
      reviewStatus: 'pending_review',
      summary: 'Awaiting compliance review before becoming publicly visible.',
    },
    {
      id: 3,
      title: 'Internal training clip',
      duration: '1:12',
      reviewStatus: 'restricted',
      summary: 'Hidden due to media policy checks. Only visible to the factory admin.',
    },
  ]

  const visibleVideos = videoGallery.filter((video) => video.reviewStatus === 'approved')

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      {/* TOP NAVIGATION */}
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto p-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1 sticky top-6 self-start">
            <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg">{factory.name}</h2>
                    {factory.verified && (
                      <div className="flex items-center gap-1 bg-[#E8F3FF] text-[#0A66C2] px-2 py-0.5 rounded-full text-sm font-semibold">
                        <span className="w-5 h-5 bg-[#0A66C2] text-white rounded-full flex items-center justify-center">✓</span>
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-[#5A5A5A]">{factory.location}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-[#5A5A5A]">
                <div>Capacity: <strong className="text-[#1A1A1A]">{factory.capacity}</strong></div>
                <div>Employees: <strong className="text-[#1A1A1A]">{factory.employees}</strong></div>
                <div>Certifications:</div>
                <div className="flex gap-2 mt-1">
                  {factory.certifications.map(c => (
                    <span key={c} className="px-2 py-1 bg-[#F4F9FF] rounded-md text-sm text-[#0A66C2]">{c}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link to="/factory/chat" className="flex-1 bg-[#0A66C2] text-white py-2 rounded-xl text-center hover:bg-[#083B75]">Send Message</Link>
                <Link to="/factory/products" className="flex-1 border border-gray-200 py-2 rounded-xl text-center hover:bg-gray-50 neo-panel cyberpunk-card">View Products</Link>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-2 space-y-6">
            <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
              <div className="flex gap-4 border-b border-gray-100 pb-3 mb-3">
                <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-[#0A66C2] text-[#0A66C2]' : 'text-[#5A5A5A]'}`}>Overview</button>
                <button onClick={() => setActiveTab('products')} className={`px-4 py-2 ${activeTab === 'products' ? 'border-b-2 border-[#0A66C2] text-[#0A66C2]' : 'text-[#5A5A5A]'}`}>Products</button>
                <button onClick={() => setActiveTab('videos')} className={`px-4 py-2 ${activeTab === 'videos' ? 'border-b-2 border-[#0A66C2] text-[#0A66C2]' : 'text-[#5A5A5A]'}`}>Video Gallery</button>
                <button onClick={() => setActiveTab('reviews')} className={`px-4 py-2 ${activeTab === 'reviews' ? 'border-b-2 border-[#0A66C2] text-[#0A66C2]' : 'text-[#5A5A5A]'}`}>Reviews</button>
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-4 p-3">
                  <p className="text-[#5A5A5A]">{factory.about}</p>

                  <div>
                    <h4 className="font-semibold">Machinery</h4>
                    <ul className="text-sm text-[#5A5A5A] mt-2">
                      {factory.machinery.map(m => <li key={m}>• {m}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold">Specializations</h4>
                    <div className="flex gap-2 mt-2">
                      {factory.specializations.map(s => (
                        <span key={s} className="px-3 py-1 bg-[#F4F9FF] rounded-full text-sm text-[#0A66C2]">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold">Export Countries</h4>
                    <div className="text-sm text-[#5A5A5A] mt-2">{factory.export.join(', ')}</div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
                  {products.map(p => (
                    <div key={p.id} className="bg-white neo-panel cyberpunk-card border border-gray-100 rounded-lg p-3">
                      <div className="w-full h-36 bg-gray-100 rounded-md mb-2"></div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-[#5A5A5A]">{p.category} • MOQ {p.moq}</div>
                      <div className="mt-2 flex gap-2">
                        <button className="px-3 py-1 bg-[#0A66C2] text-white rounded-md">Quick View</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="space-y-4 p-3">
                  <div>
                    <h4 className="font-semibold">Video Gallery</h4>
                    <p className="text-sm text-[#5A5A5A] mt-1">Only approved media is public. Pending or restricted items remain hidden until moderation is completed.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {visibleVideos.map((video) => (
                      <article key={video.id} className="bg-white neo-panel cyberpunk-card border border-gray-100 rounded-lg p-3">
                        <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-[#5A5A5A]">Video Preview</div>
                        <div className="mt-3 flex items-start justify-between gap-2">
                          <div>
                            <h5 className="font-semibold text-sm">{video.title}</h5>
                            <p className="text-xs text-[#5A5A5A] mt-1">{video.summary}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#E8F3FF] text-[#0A66C2] font-semibold uppercase">{video.reviewStatus.replace('_', ' ')}</span>
                        </div>
                        <div className="text-xs text-[#5A5A5A] mt-2">Duration: {video.duration}</div>
                      </article>
                    ))}
                  </div>

                  {videoGallery.some((video) => video.reviewStatus !== 'approved') && (
                    <div className="border border-amber-200 bg-amber-50 rounded-lg px-4 py-3 text-sm text-amber-900">
                      {videoGallery.filter((video) => video.reviewStatus !== 'approved').length} video(s) are currently hidden due to moderation status.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3 p-3">
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-[#0A66C2]">{ratingSummary?.aggregate?.average_score || '0.0'}</span>
                      <div>
                        <div className="text-lg">{starsFromAverage(ratingSummary?.aggregate?.average_score)}</div>
                        <div className="text-sm text-[#5A5A5A]">{ratingSummary?.aggregate?.total_count || 0} reviews</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#5A5A5A]">Breakdown: 5★ {ratingSummary?.breakdown?.[5] || 0} • 4★ {ratingSummary?.breakdown?.[4] || 0} • 3★ {ratingSummary?.breakdown?.[3] || 0} • 2★ {ratingSummary?.breakdown?.[2] || 0} • 1★ {ratingSummary?.breakdown?.[1] || 0}</div>
                  {(ratingSummary?.recent_reviews || []).map((r) => (
                    <div key={r.id} className="border border-gray-100 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold">Partner</div>
                          <div className="text-sm text-[#5A5A5A]">{r.comment || 'No comment provided.'}</div>
                        </div>
                        <div className="text-sm font-semibold text-[#0A66C2]">{r.score || 0}★</div>
                      </div>
                    </div>
                  ))}
                  {!ratingSummary?.recent_reviews?.length && (
                    <div className="rounded-lg border border-dashed border-gray-200 p-3 text-sm text-[#5A5A5A]">No reviews available yet.</div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <FloatingAssistant />
    </div>
  )
}
