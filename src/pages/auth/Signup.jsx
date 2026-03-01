import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
  const [step, setStep] = useState('accountType') // accountType, step1, step2, step3
  const [accountType, setAccountType] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    country: '',
    phone: '',
    organizationName: '',
    category: 'Garments',
    description: '',
    agentName: '',
    agentPassword: '',
    agentPasswordConfirm: '',
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAccountTypeSelect = (type) => {
    setAccountType(type)
    setStep('step1')
  }

  const handleNext = () => {
    if (step === 'step1') setStep('step2')
    else if (step === 'step2') {
      if (accountType === 'Buying House') setStep('step3')
      else handleFinish()
    } else if (step === 'step3') handleFinish()
  }

  const handleFinish = () => {
    console.log('Signup completed:', { accountType, formData })
    // Redirect to dashboard
  }

  // ACCOUNT TYPE SELECTION
  if (step === 'accountType') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-blue-100">Choose your account type to get started</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* BUYER ACCOUNT */}
            <div
              onClick={() => handleAccountTypeSelect('Buyer')}
              className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Buyer Account</h3>
              <p className="text-gray-600 mb-6">Post requirements and source directly</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                Select
              </button>
            </div>

            {/* FACTORY ACCOUNT */}
            <div
              onClick={() => handleAccountTypeSelect('Factory')}
              className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">🏭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Factory Account</h3>
              <p className="text-gray-600 mb-6">Showcase products and connect with buyers</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                Select
              </button>
            </div>

            {/* BUYING HOUSE ACCOUNT */}
            <div
              onClick={() => handleAccountTypeSelect('Buying House')}
              className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Buying House</h3>
              <p className="text-gray-600 mb-6">Manage team and handle client requests</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                Select
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <span className="text-white text-sm">Already have an account? </span>
            <Link to="/login" className="text-blue-100 hover:text-white font-semibold text-sm">
              Login here
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // STEP 1: BASIC IDENTITY
  if (step === 'step1') {
    return (
      <SignupStepLayout
        step={1}
        title="Basic Identity"
        prevStep={() => setStep('accountType')}
        nextStep={handleNext}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Your country"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </SignupStepLayout>
    )
  }

  // STEP 2: ORGANIZATION SETUP
  if (step === 'step2') {
    return (
      <SignupStepLayout
        step={2}
        title="Organization Setup"
        prevStep={() => setStep('step1')}
        nextStep={handleNext}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              placeholder="Your organization name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Garments">Garments</option>
              <option value="Textile">Textile</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Logo (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition">
              <p className="text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG (max 2MB)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Tell us about your organization"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </SignupStepLayout>
    )
  }

  // STEP 3: ROLE SETUP (BUYING HOUSE ONLY)
  if (step === 'step3') {
    return (
      <SignupStepLayout
        step={3}
        title="Create First Agent ID"
        prevStep={() => setStep('step2')}
        nextStep={handleNext}
        isLastStep
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent ID Name *</label>
            <input
              type="text"
              value={formData.agentName}
              onChange={(e) => handleInputChange('agentName', e.target.value)}
              placeholder="Enter agent ID name (e.g., agent001)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent Password *</label>
            <input
              type="password"
              value={formData.agentPassword}
              onChange={(e) => handleInputChange('agentPassword', e.target.value)}
              placeholder="Create password for this agent"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
            <input
              type="password"
              value={formData.agentPasswordConfirm}
              onChange={(e) => handleInputChange('agentPasswordConfirm', e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            You can create more agent IDs after signing up from your dashboard.
          </p>
        </div>
      </SignupStepLayout>
    )
  }
}

/* Helper Component */
function SignupStepLayout({ step, title, prevStep, nextStep, children, isLastStep }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Step {step} of 3</span>
              <span>{Math.ceil((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>

          {children}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={prevStep}
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              {isLastStep ? 'Finish' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
