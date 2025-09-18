import React, { useState } from 'react'
import { BarChart3, TrendingUp, Clock, MapPin, Zap, Jump } from 'lucide-react'

const PlayerStats: React.FC = () => {
  const [selectedPlayer, setSelectedPlayer] = useState('player1')
  const [timeRange, setTimeRange] = useState('7d')

  const players = [
    { id: 'player1', name: 'John Smith', jersey: 23, team: 'Lakers' },
    { id: 'player2', name: 'Mike Johnson', jersey: 7, team: 'Lakers' },
    { id: 'player3', name: 'Sarah Davis', jersey: 15, team: 'Lakers' },
  ]

  const stats = {
    player1: {
      minutesPlayed: 32.5,
      distanceCovered: 4.2,
      accelerationBursts: 45,
      jumpCount: 28,
      fatigueScore: 7.2,
      maxSpeed: 8.5,
      avgSpeed: 3.2,
      heartRate: 165,
    },
    player2: {
      minutesPlayed: 28.0,
      distanceCovered: 3.8,
      accelerationBursts: 38,
      jumpCount: 22,
      fatigueScore: 6.8,
      maxSpeed: 7.9,
      avgSpeed: 2.9,
      heartRate: 158,
    },
    player3: {
      minutesPlayed: 35.0,
      distanceCovered: 4.8,
      accelerationBursts: 52,
      jumpCount: 31,
      fatigueScore: 8.1,
      maxSpeed: 9.2,
      avgSpeed: 3.5,
      heartRate: 172,
    },
  }

  const currentStats = stats[selectedPlayer as keyof typeof stats]

  const statCards = [
    {
      label: 'Minutes Played',
      value: `${currentStats.minutesPlayed}h`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Distance Covered',
      value: `${currentStats.distanceCovered} km`,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Acceleration Bursts',
      value: currentStats.accelerationBursts.toString(),
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Jump Count',
      value: currentStats.jumpCount.toString(),
      icon: Jump,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Fatigue Score',
      value: currentStats.fatigueScore.toString(),
      icon: TrendingUp,
      color: currentStats.fatigueScore > 7 ? 'text-red-600' : 'text-orange-600',
      bgColor: currentStats.fatigueScore > 7 ? 'bg-red-100' : 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Player Statistics</h1>
        <p className="text-gray-600 mt-2">Detailed performance metrics for each player</p>
      </div>

      {/* Player Selection */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Player</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => setSelectedPlayer(player.id)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedPlayer === player.id
                  ? 'border-basketball-orange bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600">{player.jersey}</span>
                </div>
                <h3 className="font-medium text-gray-900">{player.name}</h3>
                <p className="text-sm text-gray-600">{player.team}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Range Selection */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Range</h2>
        <div className="flex space-x-2">
          {['24h', '7d', '30d', 'All'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-basketball-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card stat-card">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <BarChart3 className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart Placeholder */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart visualization coming soon</p>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Max Speed</span>
              <span className="font-semibold">{currentStats.maxSpeed} km/h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Speed</span>
              <span className="font-semibold">{currentStats.avgSpeed} km/h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Heart Rate</span>
              <span className="font-semibold">{currentStats.heartRate} bpm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fatigue Level</span>
              <span className={`font-semibold ${
                currentStats.fatigueScore > 7 ? 'text-red-600' : 'text-orange-600'
              }`}>
                {currentStats.fatigueScore > 7 ? 'High' : 'Moderate'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerStats
