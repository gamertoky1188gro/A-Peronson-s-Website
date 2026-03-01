import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    // Handle login logic
    console.log('Login:', { email, password, rememberMe })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* LEFT SIDE */}
        <div className="text-white hidden md:block">
          <div className="mb-8">
            <div className="text-4xl font-bold mb-2">GarTexHub</div>
            <p className="text-lg text-blue-100">The Professional Network for Garments & Textile Industry</p>
          </div>

          {/* Illustration Placeholder */}
          <div className="mt-12 bg-white bg-opacity-10 rounded-lg p-8 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full"></div>
                <div className="flex-1 h-6 bg-white bg-opacity-20 rounded"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-6 bg-white bg-opacity-20 rounded"></div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full"></div>
                <div className="flex-1 h-6 bg-white bg-opacity-20 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN CARD */}
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto md:mx-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email / Organization ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Organization ID</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email or ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Organization ID Login */}
          <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-lg transition mb-4">
            Login with Organization ID
          </button>

          {/* Forgot Password */}
          <div className="text-center mb-6">
            <Link to="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Forgot Password?
            </Link>
          </div>

          {/* Create Account Link */}
          <div className="text-center border-t border-gray-200 pt-6">
            <span className="text-gray-600 text-sm">Don't have an account? </span>
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 text-white text-xs">
        <a href="#" className="hover:text-blue-200">Privacy Policy</a>
        <a href="#" className="hover:text-blue-200">Terms</a>
        <a href="#" className="hover:text-blue-200">Help</a>
      </div>
    </div>
  )
}
