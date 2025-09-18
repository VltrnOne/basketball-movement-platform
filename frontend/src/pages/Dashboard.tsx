import React from 'react'
import { Link } from 'react-router-dom'
import { Upload, BarChart3, Video, Users, AlertTriangle, TrendingUp } from 'lucide-react'

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Active Sessions', value: '3', icon: Video, color: 'text-blue-600' },
    { label: 'Players Tracked', value: '24', icon: Users, color: 'text-green-600' },
    { label: 'Penalties Detected', value: '12', icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Avg. Fatigue Score', value: '7.2', icon: TrendingUp, color: 'text-orange-600' },
  ]

  const recentSessions = [
    { id: 1, name: 'Practice Session - Team A', date: '2024-01-15', duration: '2h 15m', status: 'Completed' },
    { id: 2, name: 'Game vs Lakers', date: '2024-01-14', duration: '1h 45m', status: 'Processing' },
    { id: 3, name: 'Training Session', date: '2024-01-13', duration: '1h 30m', status: 'Completed' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your basketball analytics and performance insights</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/upload"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Upload Video</h3>
              <p className="text-sm text-gray-600">Analyze recorded games</p>
            </div>
          </div>
        </Link>

        <Link
          to="/live"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <Video className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Live Analysis</h3>
              <p className="text-sm text-gray-600">Real-time monitoring</p>
            </div>
          </div>
        </Link>

        <Link
          to="/stats"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View Stats</h3>
              <p className="text-sm text-gray-600">Player performance data</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sessions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Sessions</h2>
        <div className="space-y-3">
          {recentSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{session.name}</h3>
                <p className="text-sm text-gray-600">{session.date} • {session.duration}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                session.status === 'Completed' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {session.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
