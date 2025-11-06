import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Login from './pages/Login'
import Questions from './pages/Questions'
import QuestionDetail from './pages/QuestionDetail'
import Dashboard from './pages/Dashboard'
import NavBar from './components/NavBar'
import { getMe } from './api'

// Component to protect routes that require authentication
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

// Component to protect routes that require manager role
function ManagerRoute({ children }) {
  const token = localStorage.getItem('token')
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getMe(token),
    enabled: !!token,
  })

  if (!token) return <Navigate to="/login" replace />
  if (!profile?.user) return <div>Loading...</div>
  if (profile.user.role !== 'manager') return <Navigate to="/" replace />

  return children
}

export default function App() {
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  // Fetch user profile on load to determine user role and permissions
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    
    getMe(token).then(response => {
      // Handle the profile response which contains {user: {...}}
      if (response && response.user) {
        setProfile(response.user)
      }
    }).catch(() => {
      localStorage.removeItem('token')
      navigate('/login')
    })
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar
        profile={profile}
        onLogout={() => {
          localStorage.removeItem('token')
          setProfile(null)
          navigate('/login')
        }}
      />
      <Routes>
        <Route path="/login" element={<Login onLoggedIn={setProfile} />} />
        <Route path="/" element={<PrivateRoute><Questions /></PrivateRoute>} />
        <Route path="/questions/:id" element={<PrivateRoute><QuestionDetail /></PrivateRoute>} />
        <Route path="/dashboard" element={<ManagerRoute><Dashboard /></ManagerRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}




