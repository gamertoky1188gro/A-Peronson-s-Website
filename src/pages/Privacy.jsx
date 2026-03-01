import React from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function Privacy(){
  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card">
      
      {/* Shared global NavBar */}


      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-[#5A5A5A] mb-4">Last updated: 21 Feb 2026</p>

        <section className="mb-4">
          <h3 className="font-semibold">Data We Collect</h3>
          <p className="text-sm text-[#5A5A5A]">We collect account information, usage data, and uploaded documents necessary for contracts and requests.</p>
        </section>

        <section>
          <h3 className="font-semibold">Contact</h3>
          <p className="text-sm text-[#5A5A5A]">Privacy concerns: privacy@gartexhub.example</p>
        </section>
      </div>

      <FloatingAssistant />
    </div>
  )
}
