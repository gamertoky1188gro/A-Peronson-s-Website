import React from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function Terms(){
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-[#0A66C2]">GarTexHub</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-sm text-[#5A5A5A] mb-4">Last updated: 21 Feb 2026</p>

        <section className="mb-4">
          <h3 className="font-semibold">Platform Role</h3>
          <p className="text-sm text-[#5A5A5A]">GarTexHub is a platform connecting buyers and suppliers. We do not act as a financial intermediary.</p>
        </section>

        <section className="mb-4">
          <h3 className="font-semibold">User Responsibilities</h3>
          <p className="text-sm text-[#5A5A5A]">Users are responsible for their listings and communications.</p>
        </section>

        <section>
          <h3 className="font-semibold">Legal Compliance</h3>
          <p className="text-sm text-[#5A5A5A]">Users must comply with applicable laws and platform rules.</p>
        </section>
      </div>

      <FloatingAssistant />
    </div>
  )
}
