import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { getInsights } from '../api'

// SVG Icons
const QuestionIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const StatsIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

// Manager dashboard with analytics charts and metrics
export default function Dashboard() {
  const token = localStorage.getItem('token')

  const { data: insights, isLoading, error } = useQuery({
    queryKey: ['insights'],
    queryFn: () => getInsights(token),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading dashboard data...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto mt-8">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-red-800 font-semibold">Error loading dashboard</h3>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (!insights) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <p className="text-gray-500 text-lg">No data available</p>
      </div>
    )
  }

  // Prepare data for charts
  const totalAnswers = Math.round(insights.total_questions_asked * insights.average_answers_per_question)
  const chartData = [
    { name: 'Questions', value: insights.total_questions_asked, color: '#3B82F6' },
    { name: 'Answers', value: totalAnswers, color: '#10B981' },
  ]

  const topContributorsData = insights.top_3_most_active_users.map((user, index) => ({
    name: user.name,
    answers: user.answers_count,
    rank: index + 1
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-8">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="h-20 w-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-xl border border-white border-opacity-30">
              <StatsIcon />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Manager Dashboard</h1>
              <p className="text-indigo-100 text-lg md:text-xl">Monitor team engagement and productivity in real-time</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-md rounded-xl px-4 py-2 border border-white border-opacity-30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Questions Asked"
          value={insights.total_questions_asked}
          icon={<QuestionIcon />}
          gradient="from-blue-500 to-blue-600"
          bgGradient="from-blue-50 to-blue-100"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Active Contributors"
          value={insights.top_3_most_active_users.length}
          icon={<UsersIcon />}
          gradient="from-emerald-500 to-teal-600"
          bgGradient="from-emerald-50 to-teal-100"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <MetricCard
          title="Avg Answers per Question"
          value={insights.average_answers_per_question.toFixed(2)}
          icon={<TrendingUpIcon />}
          gradient="from-purple-500 to-pink-600"
          bgGradient="from-purple-50 to-pink-100"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Overview Chart */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <ChartIcon />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Activity Overview</h3>
                <p className="text-sm text-gray-500">Questions vs Answers</p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: '#6b7280', fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
                labelStyle={{ fontWeight: 600, marginBottom: '8px' }}
              />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Distribution Chart */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Engagement Distribution</h3>
                <p className="text-sm text-gray-500">Content breakdown</p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={130}
                paddingAngle={8}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
                formatter={(value) => [value, 'Count']}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Contributors Section */}
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden">
        <div className="px-6 md:px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <TrophyIcon />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Top Contributors</h3>
                <p className="text-sm text-gray-600">Most active team members</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-amber-200">
              <span className="text-sm font-medium text-gray-700">Top 3</span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {insights.top_3_most_active_users.length === 0 ? (
            <div className="px-6 md:px-8 py-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">No Contributors Yet</h4>
              <p className="text-gray-500 max-w-md mx-auto">
                Encourage your team to start asking and answering questions to see activity metrics here!
              </p>
            </div>
          ) : (
            insights.top_3_most_active_users.map((user, index) => {
              const rankColors = [
                'from-yellow-400 via-amber-400 to-orange-400',
                'from-gray-300 via-gray-400 to-gray-500',
                'from-orange-300 via-amber-400 to-yellow-400'
              ]
              const rankLabels = ['🥇', '🥈', '🥉']
              
              return (
                <div 
                  key={user.name || user.email || index} 
                  className="px-6 md:px-8 py-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`relative flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg bg-gradient-to-br ${rankColors[index]}`}>
                        <span className="text-xl">{index + 1}</span>
                        <div className="absolute -top-1 -right-1 text-lg">{rankLabels[index]}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {user.name || 'Anonymous'}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Contributor
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {user.answers_count}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Total Activity</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

// Metric card component for displaying key statistics
function MetricCard({ title, value, icon, gradient, bgGradient, iconBg, iconColor }) {
  return (
    <div className={`relative bg-gradient-to-br ${bgGradient} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden`}>
      {/* Decorative background element */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className={`text-4xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
        <div className={`${iconBg} ${iconColor} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      
      {/* Subtle bottom border gradient */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    </div>
  )
}





