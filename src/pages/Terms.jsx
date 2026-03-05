import React from 'react'

export default function Terms() {
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
              <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full">
                Legal Agreement
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Last Updated: <span className="text-slate-900 dark:text-slate-200">{lastUpdated}</span>
              </p>
            </header>

            <div className="space-y-12 text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              <section className="text-lg">
                <p>
                  This platform is an international B2B Garments and Textiles Marketplace, where Buyer, Factory and Buying House connect for professional business purposes. By creating or using an account on the platform, you agree to the following terms and conditions.
                </p>
              </section>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>

              {/* 1. Purpose of the Platform */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-800 text-sm">1</span>
                  Purpose of the Platform
                </h2>
                <ul className="space-y-3 list-none">
                  {[
                    'To establish direct and professional connections between international buyers and Garments/Textile Factories',
                    'To ensure business matching based on Buyer Request and Company Product',
                    'To manage digital contracts, communication and verification processes in a controlled manner',
                    'The platform will be operated as a controlled business environment.'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* 2. Account Policy */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-800 text-sm">2</span>
                  Account Policy
                </h2>
                <ul className="space-y-3 list-none">
                  {[
                    'It is mandatory to open an account only for legitimate business purposes.',
                    'Accurate, true and up-to-date information must be provided.',
                    'Providing incorrect, false or misleading information will result in administrative action.',
                    'The owner will create and manage a certain number of IDs in the Buying House Enterprise account.',
                    'Each user is responsible for the security of their login information.'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* 3. User Conduct */}
              <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 to-pink-700 rounded-2xl p-8 lg:p-10 text-white shadow-xl shadow-rose-200 dark:shadow-none">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 text-sm">3</span>
                    User Conduct
                  </h2>
                  <p className="mb-4 font-semibold text-rose-50">The following activities are strictly prohibited and will be subject to action:</p>
                  <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-rose-50 text-sm">
                    {[
                      'Posting fake orders or misleading Buyer Requests',
                      'Fraudulent or misleading communications',
                      'Inducing unsafe transactions outside the platform',
                      'Uploading copyright-infringing content',
                      'Promoting illegal or prohibited products',
                      'Posting obscene, immoral, or offensive content',
                      'Uploading videos with excessive musical instruments',
                      'Using copyrighted music'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1 bg-white/20 p-1 rounded-full">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm italic opacity-80">All media content must be published in a professional and business-like manner.</p>
                </div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              </section>

              {/* 4-8 Sections */}
              {[
                { 
                  id: 4, 
                  title: 'Buyer Request and Communication Policy', 
                  points: [
                    'Buyer Requests must be clear, specific, and business-like.',
                    'Messages from verified users will be displayed on a priority basis.',
                    'Other messages will be stored as requests and displayed in a controlled manner.',
                    'Spam and irrelevant communications will be controlled.',
                    'The platform will monitor and control communications.'
                  ]
                },
                { 
                  id: 5, 
                  title: 'Digital Agreements and Signatures', 
                  points: [
                    'Digital signatures executed on the platform will be considered legally binding.',
                    'A PDF copy of each agreement will be provided to both parties.',
                    'A copy will be stored in the company system as legal evidence if necessary.'
                  ]
                },
                { 
                  id: 6, 
                  title: 'Call and Chat Policy', 
                  points: [
                    'Video and audio calls made through the platform will be recorded.',
                    'All recordings will be stored only with the company.',
                    'Recordings will not be provided directly to any party, except as required by law.',
                    'Records will only be used for dispute resolution, security and legal purposes.'
                  ]
                },
                { 
                  id: 7, 
                  title: 'Ratings and Transparency', 
                  points: [
                    'Ratings will be provided by the platform upon successful order completion.',
                    'User performance and behavior will directly impact visibility.',
                    'Providing artificial or manipulated ratings will result in administrative action.'
                  ]
                },
                { 
                  id: 8, 
                  title: 'Subscription and Enterprise Benefits', 
                  points: [
                    'Buying House and Enterprise accounts will have enhanced management benefits.',
                    'Certain advanced features will be enabled through upgrades.',
                    'Subscription policies will apply where applicable.'
                  ]
                }
              ].map(section => (
                <section key={section.id}>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">{section.id}</span>
                    {section.title}
                  </h2>
                  <ul className="space-y-3 list-none pl-11">
                    {section.points.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              {/* 9. Liability */}
              <section className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-6 rounded-r-xl">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-amber-500">⚠</span>
                  9. Liability
                </h2>
                <div className="space-y-3 text-sm">
                  <p>The platform provides connectivity between Buyers and Sellers. Strong and effective security measures have been implemented to prevent fraud.</p>
                  <p className="font-semibold text-amber-700 dark:text-amber-400">If the user violates policies, verification processes or security instructions and suffers losses, the user will bear the responsibility himself.</p>
                </div>
              </section>

              {/* 10. Account Suspension */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">10</span>
                  Account Suspension or Cancellation
                </h2>
                <div className="pl-11 space-y-4">
                  <p>Accounts will be suspended or canceled in cases of: <strong>Violation of terms, Fraudulent activity, Providing false information,</strong> or <strong>Behavior that damages reputation</strong>.</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>The user will be notified before closing the account.</li>
                    <li>A warning will be given if necessary.</li>
                    <li>In case of repeated or serious violations, the account will be permanently closed.</li>
                  </ul>
                </div>
              </section>

              {/* 11-12 */}
              <div className="grid md:grid-cols-2 gap-8">
                <section className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">11. Change Policy</h3>
                  <p className="text-sm">These Terms will be updated as needed. Users will be notified of any significant changes via notification.</p>
                </section>
                <section className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">12. Consent</h3>
                  <p className="text-sm">By creating an account or using the Platform, you agree to be bound by all provisions of these Terms and Conditions.</p>
                </section>
              </div>

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
