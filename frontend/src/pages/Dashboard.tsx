import React from 'react'
import { Link } from 'react-router-dom'
import { Upload, BarChart3, Video, Users, AlertTriangle, TrendingUp, Activity, Clock } from 'lucide-react'

const Dashboard: React.FC = () => {
  const stats = [
    { 
      label: 'Active Sessions', 
      value: '3', 
      icon: Video, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+2 from last week',
      changeType: 'positive'
    },
    { 
      label: 'Players Tracked', 
      value: '24', 
      icon: Users, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+5 new players',
      changeType: 'positive'
    },
    { 
      label: 'Penalties Detected', 
      value: '12', 
      icon: AlertTriangle, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '-3 from last session',
      changeType: 'positive'
    },
    { 
      label: 'Avg. Fatigue Score', 
      value: '7.2', 
      icon: TrendingUp, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: 'Optimal range',
      changeType: 'neutral'
    },
  ]

  const recentSessions = [
    { 
      id: 1, 
      name: 'Practice Session - Team A', 
      date: '2024-01-15', 
      duration: '2h 15m', 
      status: 'Completed',
      players: 12,
      penalties: 3,
      fatigue: 6.8
    },
    { 
      id: 2, 
      name: 'Game vs Lakers', 
      date: '2024-01-14', 
      duration: '1h 45m', 
      status: 'Processing',
      players: 10,
      penalties: 8,
      fatigue: 8.2
    },
    { 
      id: 3, 
      name: 'Training Session', 
      date: '2024-01-13', 
      duration: '1h 30m', 
      status: 'Completed',
      players: 8,
      penalties: 1,
      fatigue: 5.4
    },
  ]

  const quickActions = [
    {
      title: 'Upload Video',
      description: 'Analyze recorded games and training sessions',
      icon: Upload,
      color: 'blue',
      href: '/upload'
    },
    {
      title: 'Live Analysis',
      description: 'Real-time monitoring and instant feedback',
      icon: Video,
      color: 'green',
      href: '/live'
    },
    {
      title: 'View Stats',
      description: 'Detailed player performance analytics',
      icon: BarChart3,
      color: 'purple',
      href: '/stats'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-basketball-orange to-orange-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome to Basketball Intelligence</h1>
            <p className="text-orange-100 text-lg">Monitor your basketball analytics and performance insights with AI-powered technology</p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Activity className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-700' 
                    : stat.changeType === 'negative'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            const colorClasses = {
              blue: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
              green: 'bg-green-50 hover:bg-green-100 text-green-600',
              purple: 'bg-purple-50 hover:bg-purple-100 text-purple-600'
            }
            return (
              <Link
                key={index}
                to={action.href}
                className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-xl ${colorClasses[action.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-basketball-orange transition-colors">
                    {action.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">{action.description}</p>
                <div className="mt-4 flex items-center text-basketball-orange text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Get started
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Recent Sessions</h2>
            <Link to="/stats" className="text-basketball-orange hover:text-orange-600 text-sm font-medium">
              View all →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="group p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-basketball-orange transition-colors">
                      {session.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{session.date} • {session.duration}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{session.players} players</span>
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    session.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600">{session.penalties} penalties</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-600">Fatigue: {session.fatigue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard