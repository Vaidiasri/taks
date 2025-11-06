// Note: backend mounts routes under `/api`, so include it here to match server paths
// Use environment variable in production, fallback to localhost for development
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Generic helper to call API with/without token
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options)
  if (!res.ok) {
    let errorMessage = res.statusText
    try {
      const errorData = await res.json()
      errorMessage = errorData.message || errorData.error || errorMessage
    } catch {
      const text = await res.text()
      errorMessage = text || errorMessage
    }
    throw new Error(errorMessage)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

// Authentication API functions
export async function register({ name, email, password, role }) {
  // Register new user with name, email, password, and role
  const response = await request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  })
  if (response.token && response.user) {
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
  }
  return response
}

export async function login({ email, password }) {
  // Login using email and password (OAuth2 form body)
  // Server expects JSON (express.json middleware). Send JSON to match backend.
  const response = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (response.token && response.user) {
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
  }
  return response
}

export async function getMe(token) {
  // Get current user profile information
  // Backend route is `/api/auth/profile`
  return request('/auth/profile', { 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
}

// Questions API functions
export async function listQuestions(token, search = '') {
  // List all questions with optional search parameter (public endpoint)
  const url = search ? `/questions?search=${encodeURIComponent(search)}` : '/questions'
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const response = await request(url, { headers })
  // Backend returns { questions, totalPages, currentPage, total } but we need just questions array
  return response.questions || []
}

export async function createQuestion(token, { title, description, tags }) {
  // Create a new question with title, description, and tags
  const response = await request('/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, description, tags })
  })
  return response.question || response
}

export async function getQuestion(token, id) {
  // Get a specific question by ID (public endpoint)
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const response = await request(`/questions/${id}`, { headers })
  // Backend returns { question } but we need just the question object
  return response.question || response
}

// Answers API functions
export async function listAnswers(token, questionId) {
  // List all answers for a specific question (public endpoint)
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const response = await request(`/answers/${questionId}`, { headers })
  // Backend returns { answers } but we need just the answers array
  return response.answers || []
}

export async function createAnswer(token, questionId, { text }) {
  // Create a new answer for a specific question
  return request(`/answers/${questionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text })
  })
}

// Insights API functions
export async function getInsights(token) {
  // Get manager insights (total questions, top users, average answers per question)
  return request('/insights', { headers: { Authorization: `Bearer ${token}` } })
}




