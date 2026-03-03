import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card">
      <div className="max-w-5xl mx-auto p-8">
        <header className="mb-10 border-b border-[#E5E5E5] pb-6">
          <h1 className="text-4xl font-bold text-[#0A192F] mb-3">About GarTexHub</h1>
          <p className="text-lg text-[#5A5A5A] italic">
            A professional B2B platform built exclusively for the Garments and Textile industry.
          </p>
        </header>

        <section className="mb-10">
          <p className="text-[#333333] leading-relaxed mb-4">
            GarTexHub is a professional B2B platform built exclusively for the Garments and Textile industry. 
            Our goal is to create a structured, transparent, and trust-driven environment where international 
            buyers, factories, and buying houses can connect with confidence.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Why GarTexHub Exists</h2>
          <p className="text-[#333333] leading-relaxed mb-4">
            Cross-border textile trade often depends on informal communication, scattered documents, and manual 
            verification processes. This creates inefficiencies, misunderstandings, and trust barriers.
          </p>
          <p className="text-[#333333] leading-relaxed">
            GarTexHub was created to solve this problem by combining structured communication, verified 
            business identities, and secure documentation within one unified system.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <section className="bg-[#F8F9FA] p-6 border-l-4 border-[#0056B3]">
            <h2 className="text-xl font-bold text-[#0A192F] mb-3">Our Mission</h2>
            <p className="text-[#5A5A5A] leading-relaxed">
              To simplify international garment sourcing by building a secure digital infrastructure that 
              prioritizes credibility, transparency, and efficiency.
            </p>
          </section>

          <section className="bg-[#F8F9FA] p-6 border-l-4 border-[#0056B3]">
            <h2 className="text-xl font-bold text-[#0A192F] mb-3">Our Vision</h2>
            <p className="text-[#5A5A5A] leading-relaxed">
              To become a trusted digital bridge between global buyers and garment manufacturers, reducing 
              negotiation friction and strengthening international trade relationships.
            </p>
          </section>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#0A192F] mb-4">How the Platform Works</h2>
          <ul className="space-y-3 text-[#333333]">
            <li className="flex items-start gap-2">
              <span className="text-[#0056B3] font-bold">•</span>
              <span>Buyers can post structured requests with detailed specifications.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0056B3] font-bold">•</span>
              <span>Factories and Buying Houses can showcase products and capabilities.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0056B3] font-bold">•</span>
              <span>Verified accounts increase trust through document-based validation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0056B3] font-bold">•</span>
              <span>Built-in communication tools enable secure discussions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0056B3] font-bold">•</span>
              <span>Digital contracts and document storage ensure record integrity.</span>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Verification & Trust</h2>
          <p className="text-[#333333] leading-relaxed mb-4">
            GarTexHub uses a document-based verification system. Companies must submit legal and operational 
            documents, which are manually reviewed before verification status is granted.
          </p>
          <p className="text-[#333333] leading-relaxed mb-4">
            Verification is subscription-based and must be maintained to ensure ongoing compliance.
          </p>
          <p className="text-[#333333] leading-relaxed">
            The more verified documentation a company provides, the stronger its credibility and international acceptance.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Industry Focus</h2>
          <p className="text-[#333333] leading-relaxed">
            GarTexHub is strictly dedicated to the Garments and Textile sector. By focusing on a single industry, 
            we provide smarter categorization, clearer communication, and more relevant matching between 
            buyers and manufacturers.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Professional Commitment</h2>
          <p className="text-[#333333] leading-relaxed mb-4">
            We do not process direct financial transactions. Our platform is designed to facilitate secure 
            communication, structured agreements, and verified business interactions.
          </p>
          <p className="text-[#333333] leading-relaxed">
            GarTexHub operates with the principle that trust is earned through transparency, documentation, 
            and professional conduct.
          </p>
        </section>

        <footer className="mt-12 pt-8 border-t border-[#E5E5E5]">
          <h2 className="text-xl font-bold text-[#0A192F] mb-3">Contact & Legal Information</h2>
          <p className="text-[#5A5A5A] leading-relaxed">
            For partnership inquiries, support, or compliance-related questions, please contact us through 
            our official communication channels listed on the platform.
          </p>
        </footer>
      </div>
    </div>
  )
}
