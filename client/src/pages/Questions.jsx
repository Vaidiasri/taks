import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { listQuestions, createQuestion } from '../api'

// Modal component for asking questions
function AskQuestionModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  })

  function handleSubmit(e) {
    e.preventDefault()
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    onSubmit({
      title: formData.title,
      description: formData.description,
      tags: tagsArray
    })
    setFormData({ title: '', description: '', tags: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl text-white">•</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Ask a Question</h3>
              <p className="text-gray-600">Share your question with the team</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Question Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="What's your question about?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                id="description"
                placeholder="Provide more context and details about your question..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">
                Tags <span className="text-gray-500 font-normal">(optional - comma separated)</span>
              </label>
              <input
                id="tags"
                type="text"
                placeholder="javascript, react, api, help"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">Tags help others find your question</p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Post Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Main Questions page component
export default function Questions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const token = localStorage.getItem('token')
  const queryClient = useQueryClient()

  // Fetch questions with search functionality
  const { data: questions = [], isLoading, error } = useQuery({
    queryKey: ['questions', searchTerm],
    queryFn: () => listQuestions(token, searchTerm),
  })

  // Mutation for creating new questions
  const createQuestionMutation = useMutation({
    mutationFn: (questionData) => createQuestion(token, questionData),
    onSuccess: () => {
      queryClient.invalidateQueries(['questions'])
      toast.success('Question posted successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to post question')
    }
  })

  function handleSearch(e) {
    e.preventDefault()
    // Search is handled automatically by the query
  }

  function handleAskQuestion(questionData) {
    createQuestionMutation.mutate(questionData)
  }

  if (error) {
    return <div className="text-red-600">Error loading questions: {error.message}</div>
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Team Questions</h1>
            <p className="text-blue-100 text-lg">Share knowledge and get answers from your team</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
          >
            <span>•</span>
            <span>Ask a Question</span>
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search questions by keyword or tag..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Search
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading questions...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">No Questions</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No questions found' : 'No questions yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms or browse all questions.'
                : 'Be the first to ask a question and start the conversation!'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Ask the First Question
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {questions.map(q => {
              // Handle populated createdBy field (could be object or string)
              const createdBy = typeof q.createdBy === 'object' ? q.createdBy : { name: q.createdBy || 'Unknown' }
              const questionId = q._id || q.id
              
              return (
                <div key={questionId} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{q.title}</h3>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {(createdBy.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">{q.description}</p>

                  {/* Tags */}
                  {q.tags && q.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {q.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>By</span>
                      <span className="font-medium">{createdBy.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/questions/${questionId}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <span>View Answers</span>
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAskQuestion}
      />
    </div>
  )
}





