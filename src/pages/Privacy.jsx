import React from 'react'

export default function Privacy() {
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 p-4 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-8 lg:p-16">
            <header className="mb-12 text-center">
              <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-sky-600 uppercase bg-sky-50 dark:bg-sky-900/30 dark:text-sky-400 rounded-full">
                Legal Documentation
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Last Updated: <span className="text-slate-900 dark:text-slate-200">{lastUpdated}</span>
              </p>
            </header>

            <div className="space-y-12 text-slate-700 dark:text-slate-300 leading-relaxed">
              <section className="text-lg">
                <p>
                  This Privacy Policy explains how our B2B Garments and Textile Marketplace platform collects, uses, protects, and manages your information. 
                  Our platform connects international Buyers, Factories, and Buying Houses in a secure and professional environment.
                  By creating an account or using our services, you agree to the practices described in this policy.
                </p>
              </section>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">1</span>
                  Information We Collect
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">Account Data</h3>
                    <ul className="space-y-2 list-none">
                      {['Full Name', 'Organization Name', 'Email Address', 'Phone Number', 'Country', 'Verification Docs', 'Account Type'].map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">Business Data</h3>
                    <ul className="space-y-2 list-none">
                      {['Product Specifications', 'Design Requirements', 'Order Documents', 'Digital Signature Records'].map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">Communications</h3>
                    <ul className="space-y-2 list-none">
                      {['Chat messages', 'Video/Audio logs', 'Call recordings'].map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">Technical Information</h3>
                    <ul className="space-y-2 list-none">
                      {['IP address', 'Device/Browser type', 'Usage activity', 'Search history'].map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">2</span>
                  How We Use Your Information
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                  <ul className="grid md:grid-cols-2 gap-4">
                    {[
                      'Account Management', 'Order Matching', 'AI-Assisted Replies', 
                      'Secure Communications', 'Digital Contracts', 'Fraud Prevention', 'Personalized Alerts'
                    ].map(item => (
                      <li key={item} className="flex items-center gap-3 text-sm font-medium">
                        <span className="text-sky-500">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 to-indigo-700 rounded-2xl p-8 lg:p-10 text-white shadow-xl shadow-sky-200 dark:shadow-none">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-6">3. Fraud Prevention Measures</h2>
                  <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sky-50">
                    {[
                      'Identity verification process',
                      'Secure digital contracts',
                      'Recorded calls for disputes',
                      'Verified user visibility',
                      'Role-based access control',
                      'Suspicious activity monitoring',
                      'Secure reference exchange'
                    ].map(item => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 bg-white/20 p-1 rounded-full">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-sky-400/20 rounded-full blur-3xl"></div>
              </section>

              {[
                { id: 4, title: 'Data Sharing Policy', text: 'We do not sell personal data to third parties. Information may be shared only between involved business partners, when legally required, or to prevent fraud.' },
                { id: 5, title: 'Call Recording & Chat Storage', text: 'All communications conducted within the platform may be securely stored. Call recordings are retained strictly for legal protection and dispute resolution.' },
                { id: 6, title: 'Digital Contracts & Signatures', text: 'Digital signatures executed through the platform are legally binding. PDF copies are provided and securely stored for legal record integrity.' },
                { id: 7, title: 'Data Security', text: 'We employ encrypted transmission, secure server infrastructure, multi-level authentication, and granular role-based permissions.' },
                { id: 8, title: 'User Rights', text: 'You have the right to update info, request deletion, obtain a copy of your data, and manage notification preferences.' }
              ].map(item => (
                <section key={item.id}>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {item.id}. {item.title}
                  </h2>
                  <p className="bg-white dark:bg-transparent border-l-2 border-slate-200 dark:border-slate-800 pl-6">
                    {item.text}
                  </p>
                </section>
              ))}

              <section className="bg-slate-900 dark:bg-white p-8 rounded-2xl text-white dark:text-slate-900">
                <h2 className="text-xl font-bold mb-4">13. Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-slate-400 dark:text-slate-500 text-sm">Direct Support</p>
                    <p className="font-bold underline decoration-sky-500 underline-offset-4">support@gartexhub.com</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <a href="#" className="p-2 bg-white/10 dark:bg-slate-100 rounded-lg hover:bg-white/20 dark:hover:bg-slate-200 transition-colors">LinkedIn</a>
                    <a href="#" className="p-2 bg-white/10 dark:bg-slate-100 rounded-lg hover:bg-white/20 dark:hover:bg-slate-200 transition-colors">Facebook</a>
                  </div>
                </div>
              </section>

              <footer className="text-center pt-8 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                  © 2026 GarTexHub Professional Network. All Rights Reserved.
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
