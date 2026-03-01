import React from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function About(){
  return (
    <div className="min-h-screen bg-white">
      
      {/* Shared global NavBar */}


      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">GarTexHub</h1>
          <p className="text-sm text-[#5A5A5A] mt-2">Dedicated B2B network for garments & textile — connect buyers, factories and buying houses.</p>
        </header>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="mt-2 text-[#5A5A5A]">Professional supply chain connections for the textile industry.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold">Why GarTexHub?</h2>
          <ul className="list-disc ml-6 mt-2 text-[#5A5A5A]">
            <li>Industry focused</li>
            <li>Secure contracts</li>
            <li>AI assisted workflow</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="mt-2 text-[#5A5A5A]">support@gartexhub.example</p>
        </section>
      </div>

      <FloatingAssistant />
    </div>
  )
}
