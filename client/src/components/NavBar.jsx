import React from 'react'
import { Link, useLocation } from 'react-router-dom'

// Navigation bar component with responsive design and conditional manager access
export default function NavBar({ profile, onLogout }) {
  const { pathname } = useLocation()

  // Helper function to determine if a link is active
  const isActive = (path) => pathname === path

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 mb-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-lg font-bold text-white">TP</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">Team Pulse</h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Questions
            </Link>
            {profile?.role === 'manager' && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {profile ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {profile?.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {profile?.name || 'User'}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {profile?.role || 'member'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/login')
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200'
                }`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}




