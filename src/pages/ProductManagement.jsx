import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function ProductManagement(){
  const [products] = useState([
    { id: 'P-100', title: 'Pique Polo', category: 'Knitwear', moq: 200, price: '$3 - $5' },
    { id: 'P-101', title: 'Denim Jacket', category: 'Woven', moq: 300, price: '$15 - $25' },
  ])

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Product Management</h1>
            <p className="text-sm text-[#5A5A5A]">Manage factory products and media</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#0A66C2] text-white rounded-md">+ Create Product</button>
            <button className="px-4 py-2 border rounded-md">+ Upload Video</button>
          </div>
        </div>

        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="bg-white neo-panel cyberpunk-card border rounded-lg p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-20 h-16 bg-gray-100 rounded"></div>
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-[#5A5A5A]">{p.category} • MOQ {p.moq}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border rounded">Edit</button>
                <button className="px-3 py-1 border rounded">Delete</button>
                <button className="px-3 py-1 bg-[#0A66C2] text-white rounded">Analytics</button>
              </div>
            </div>
          ))}
        </div>

      </div>

      <FloatingAssistant />
    </div>
  )
}
