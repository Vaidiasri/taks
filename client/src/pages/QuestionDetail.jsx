import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getQuestion, listAnswers, createAnswer } from '../api'

// Question detail page with answers and ability to post new answers
export default function QuestionDetail() {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [answerText, setAnswerText] = useState('')
  const queryClient = useQueryClient()

  // Fetch question details
  const { data: question, isLoading: questionLoading, error: questionError } = useQuery({
    queryKey: ['question', id],
    queryFn: () => getQuestion(token, id),
  })

  // Fetch answers for this question
  const { data: answers = [], isLoading: answersLoading, error: answersError } = useQuery({
    queryKey: ['answers', id],
    queryFn: () => listAnswers(token, id),
  })

  // Mutation for creating new answers
  const createAnswerMutation = useMutation({
    mutationFn: (answerData) => createAnswer(token, id, answerData),
    onSuccess: () => {
      queryClient.invalidateQueries(['answers', id])
      setAnswerText('')
      toast.success('Answer posted successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to post answer')
    }
  })

  function handleSubmitAnswer(e) {
    e.preventDefault()
    if (!answerText.trim()) return

    createAnswerMutation.mutate({ text: answerText })
  }

  if (questionLoading) return <div className="text-center py-8">Loading question...</div>
  if (questionError) return <div className="text-red-600">Error: {questionError.message}</div>
  if (!question) return <div className="text-gray-500">Question not found</div>

  // Handle populated createdBy field (could be object or string)
  const createdBy = typeof question.createdBy === 'object' ? question.createdBy : { name: question.createdBy || 'Unknown' }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Question Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">
                {(createdBy.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{question.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center space-x-1">
                <span>By</span>
                <span className="font-medium">{createdBy.name || 'Unknown'}</span>
              </span>
              <span>•</span>
              <span>{new Date(question.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{question.description}</p>
        </div>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-200 shadow-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Answers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <span>Reply</span>
            <span>Answers ({answers.length})</span>
          </h2>
        </div>

        {answersLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading answers...</span>
          </div>
        ) : answersError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            Error loading answers: {answersError.message}
          </div>
        ) : answers.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">💭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No answers yet</h3>
            <p className="text-gray-600">Be the first to share your knowledge and help answer this question!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {answers.map(a => {
              // Handle populated createdBy field (could be object or string)
              const answerCreatedBy = typeof a.createdBy === 'object' ? a.createdBy : { name: a.createdBy || 'Unknown' }
              const answerId = a._id || a.id
              
              return (
                <div key={answerId} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-white">
                          {(answerCreatedBy.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="font-semibold text-gray-900">{answerCreatedBy.name || 'Unknown'}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-600">
                          {new Date(a.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{a.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Post Answer Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xl">Q:</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Share Your Answer</h3>
            <p className="text-gray-600">Help your team member with your knowledge and expertise</p>
          </div>
        </div>

        <form onSubmit={handleSubmitAnswer} className="space-y-6">
          <div>
            <textarea
              placeholder="Write a detailed answer to help solve this question..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical bg-white shadow-sm"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createAnswerMutation.isLoading || !answerText.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              {createAnswerMutation.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <span>Post Answer</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}





