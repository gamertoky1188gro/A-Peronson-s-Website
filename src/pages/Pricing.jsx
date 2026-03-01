import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

function SubscriptionArea(){
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [accountType, setAccountType] = useState('General')

  const accountTypes = isLoggedIn ? ['General', 'Factory'] : []

  const features = {
    notLoggedIn: {
      Free: [
        'Basic Dashboard Access',
        'Partner Network Access',
        'Claim Buyer Requests',
        'Chat & Call Access',
        'Contract Vault (Basic)',
        'Limited Sub-Accounts'
      ],
      Premium: [
        'Dedicated Analytics Page',
        'Exportable Reports',
        'Advanced Insights',
        'Priority Messaging',
        'Extended Contract Vault',
        'Unlimited Sub-Accounts',
        'Increased Account Reach'
      ]
    },
    loggedIn: {
      General: {
        Free: [
          'Basic Dashboard Access',
          'Partner Network Access',
          'Claim Buyer Requests',
          'Chat & Call Access',
          'Contract Vault (Basic)',
          'Sub-Accounts: Limit 10'
        ],
        Premium: [
          'Dedicated Analytics Page',
          'Exportable Reports',
          'Advanced Insights',
          'Priority Messaging Inbox',
          'Extended Contract Vault',
          'Unlimited Sub-Accounts',
          'Increased Account Reach'
        ]
      },
      Factory: {
        Free: [
          'Product Management',
          'Video Gallery',
          'Partner Network Requests',
          'Chat & Call Access',
          'Contract Vault (Basic)',
          'Multiple Account IDs: Supported',
          'Sub-Accounts: Limit 10'
        ],
        Premium: [
          'Full Product & Order Management',
          'Video & Media Showcase',
          'AI Assistance for Requests',
          'Exportable Reports',
          'Extended Contract Vault',
          'Multiple Account IDs: Unlimited',
          'Unlimited Sub-Accounts',
          'Increased Account Reach'
        ]
      }
    }
  }

  const getFreeFeatures = () => {
    if (!isLoggedIn) return features.notLoggedIn.Free
    return features.loggedIn[accountType].Free
  }

  const getPremiumFeatures = () => {
    if (!isLoggedIn) return features.notLoggedIn.Premium
    return features.loggedIn[accountType].Premium
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Subscription Packages</h3>
          <p className="text-sm text-gray-600">Choose between Free and Premium to match your needs.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm">
            {isLoggedIn ? <span className="font-medium text-green-600">Logged in</span> : <span className="text-gray-500">Not logged in</span>}
          </div>
          <button onClick={() => {
            setIsLoggedIn(!isLoggedIn)
            setAccountType('General')
          }} className="px-3 py-1 border rounded text-sm">
            {isLoggedIn ? 'Sign out' : 'Mock Sign in'}
          </button>
        </div>
      </div>

      {isLoggedIn && accountTypes.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Select Account Type:</p>
          <div className="flex gap-2 flex-wrap">
            {accountTypes.map(t => (
              <button key={t} onClick={() => setAccountType(t)} className={`px-3 py-1 rounded ${accountType===t? 'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Free Card */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold">Free</h4>
              <p className="text-sm text-gray-500">Start with essential features.</p>
            </div>
            <div className="text-sm text-gray-700">Free</div>
          </div>

          <ul className="mt-4 space-y-2 text-sm">
            {getFreeFeatures().map((f,i) => <li key={i}>• {f}</li>)}
          </ul>

          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded">Get Started</button>
          </div>
        </div>

        {/* Premium Card */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold">Premium</h4>
              <p className="text-sm text-gray-500">Unlock full power and reach.</p>
            </div>
            <div className="text-sm text-indigo-600 font-semibold">Premium</div>
          </div>

          <ul className="mt-4 space-y-2 text-sm">
            {getPremiumFeatures().map((f,i) => <li key={i}>• {f}</li>)}
          </ul>

          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded">Choose Premium</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Pricing(){
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">

      {/* NAVBAR */}
      
      {/* Shared global NavBar */}


      {/* HERO */}
      <header className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Power Your Buying House with Structured Growth</h1>
            <p className="mt-4 text-gray-600">Choose the plan that matches your organization size. Upgrade anytime as your team expands.</p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-gray-500">Monthly</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-14 h-7 bg-gray-200 rounded-full peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm font-semibold text-gray-900">Annual <span className="text-indigo-600">(Save 20%)</span></span>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-4 w-16 bg-gray-100 rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-12 bg-white border rounded" />
                <div className="h-12 bg-white border rounded" />
                <div className="h-12 bg-white border rounded" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PLANS */}
      <section className="max-w-7xl mx-auto px-4 py-12" id="plans">
        <h2 className="text-2xl font-bold text-center mb-8">Simple, Transparent Pricing</h2>
        {/* Subscription interactive area */}
        <div className="max-w-4xl mx-auto">
          <SubscriptionArea />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center">Feature Comparison</h2>
        <div className="mt-6 overflow-x-auto bg-white border rounded-lg">
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-4 px-6">Feature</th>
              <th className="py-4 px-6">Free BH</th>
              <th className="py-4 px-6">Enterprise BH</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-4 px-6">Sub Accounts Limit</td>
              <td className="py-4 px-6">10</td>
              <td className="py-4 px-6">Unlimited</td>
            </tr>
            <tr>
              <td className="py-4 px-6">Dedicated Analytics Page</td>
              <td className="py-4 px-6">No</td>
              <td className="py-4 px-6">Yes</td>
            </tr>
            <tr>
              <td className="py-4 px-6">Report Export</td>
              <td className="py-4 px-6">No</td>
              <td className="py-4 px-6">Yes</td>
            </tr>
            <tr>
              <td className="py-4 px-6">Advanced Insights</td>
              <td className="py-4 px-6">No</td>
              <td className="py-4 px-6">Yes</td>
            </tr>
            <tr>
              <td className="py-4 px-6">Buying Pattern Analysis</td>
              <td className="py-4 px-6">No</td>
              <td className="py-4 px-6">Yes</td>
            </tr>
            <tr>
              <td className="py-4 px-6">Contract Vault Storage</td>
              <td className="py-4 px-6">Basic</td>
              <td className="py-4 px-6">Extended</td>
            </tr>
            <tr>
              <td className="py-4 px-6">Order Completion Certification</td>
              <td className="py-4 px-6">No</td>
              <td className="py-4 px-6">Yes</td>
            </tr>
            <tr>
              <td className="py-4 px-6">Search Filtering Priority</td>
              <td className="py-4 px-6">Standard</td>
              <td className="py-4 px-6">Advanced</td>
            </tr>
            <tr>
              <td className="py-4 px-6">Support Level</td>
              <td className="py-4 px-6">Standard</td>
              <td className="py-4 px-6">Dedicated</td>
            </tr>
          </tbody>
          </table>
        </div>
      </section>

      {/* WHY UPGRADE */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">Why Enterprise Matters?</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <h4 className="font-bold">Team Scale</h4>
              <p className="text-sm text-gray-600 mt-2">Manage large agent teams without restrictions.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h4 className="font-bold">Data Visibility</h4>
              <p className="text-sm text-gray-600 mt-2">Understand which agents close more deals.</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h4 className="font-bold">Competitive Advantage</h4>
              <p className="text-sm text-gray-600 mt-2">Use advanced analytics to identify demand trends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center">FAQ</h3>
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="font-semibold">Q: Can I upgrade anytime?</h4>
              <p className="text-sm text-gray-600">A: Yes, your data remains intact.</p>
            </div>
            <div>
              <h4 className="font-semibold">Q: Can I downgrade?</h4>
              <p className="text-sm text-gray-600">A: Yes, but sub-account limits will apply.</p>
            </div>
            <div>
              <h4 className="font-semibold">Q: Does GarTexHub handle payments?</h4>
              <p className="text-sm text-gray-600">A: No. The platform facilitates coordination and contract management only.</p>
            </div>
            <div>
              <h4 className="font-semibold">Q: Are calls recorded?</h4>
              <p className="text-sm text-gray-600">A: Yes, for documentation and compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">Build a Structured Textile Network Today</h2>
          <div className="mt-6">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-bold">Create Your Organization</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-bold text-lg">GarTexHub</div>
            <div className="text-sm text-gray-600 mt-2">Professional B2B sourcing for garments & textiles.</div>
          </div>
          <div className="flex justify-center">
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:text-blue-700">About</a></li>
              <li><a href="#" className="hover:text-blue-700">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-700">Terms</a></li>
              <li><a href="#" className="hover:text-blue-700">Contact</a></li>
              <li><a href="#" className="hover:text-blue-700">Help Center</a></li>
            </ul>
          </div>
          <div className="text-right text-sm text-gray-700">
            <div>Contact: support@gartexhub.example</div>
          </div>
        </div>
        <div className="border-t py-4">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">© GarTexHub</div>
        </div>
      </footer>

      <FloatingAssistant />
    </div>
  )
}
