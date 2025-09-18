import React, { useState, useEffect } from 'react'
import { Play, Pause, Square, AlertTriangle, Users, Activity } from 'lucide-react'

const LiveAnalysis: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [streamTime, setStreamTime] = useState(0)
  const [alerts, setAlerts] = useState<Array<{
    id: string
    type: 'penalty' | 'fatigue' | 'injury'
    message: string
    timestamp: number
    severity: 'low' | 'medium' | 'high'
  }>>([])

  // Simulate live data updates
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamTime(prev => prev + 1)
        
        // Simulate random alerts
        if (Math.random() < 0.1) {
          const alertTypes = ['penalty', 'fatigue', 'injury'] as const
          const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
          const severities = ['low', 'medium', 'high'] as const
          const severity = severities[Math.floor(Math.random() * severities.length)]
          
          const messages = {
            penalty: ['Traveling detected', 'Double dribble', 'Defensive 3 seconds'],
            fatigue: ['High fatigue level', 'Player needs rest', 'Fatigue alert'],
            injury: ['Potential injury risk', 'Excessive load detected', 'Injury prevention alert']
          }
          
          const message = messages[alertType][Math.floor(Math.random() * messages[alertType].length)]
          
          setAlerts(prev => [...prev, {
            id: Date.now().toString(),
            type: alertType,
            message,
            timestamp: streamTime,
            severity
          }])
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStreaming, streamTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startStreaming = () => {
    setIsStreaming(true)
    setIsRecording(true)
  }

  const stopStreaming = () => {
    setIsStreaming(false)
    setIsRecording(false)
  }

  const pauseStreaming = () => {
    setIsStreaming(false)
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live Analysis</h1>
        <p className="text-gray-600 mt-2">Real-time monitoring and analysis of basketball games</p>
      </div>

      {/* Stream Controls */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {isStreaming ? 'Streaming' : 'Offline'}
              </span>
            </div>
            <div className="text-2xl font-mono text-gray-900">
              {formatTime(streamTime)}
            </div>
          </div>
          
          <div className="flex space-x-2">
            {!isStreaming && !isRecording && (
              <button
                onClick={startStreaming}
                className="btn-primary flex items-center space-x-2"
              >
                <Play size={16} />
                <span>Start Stream</span>
              </button>
            )}
            
            {isStreaming && (
              <button
                onClick={pauseStreaming}
                className="btn-secondary flex items-center space-x-2"
              >
                <Pause size={16} />
                <span>Pause</span>
              </button>
            )}
            
            {isRecording && (
              <button
                onClick={stopStreaming}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
              >
                <Square size={16} />
                <span>Stop Recording</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Stream */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Feed</h2>
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {isStreaming ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Activity className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <p className="text-lg font-medium">Live Stream Active</p>
                    <p className="text-sm text-gray-300">Camera feed would appear here</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Activity className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">No Active Stream</p>
                    <p className="text-sm">Start streaming to begin analysis</p>
                  </div>
                </div>
              )}
              
              {/* Overlay Stats */}
              {isStreaming && (
                <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
                  <div className="text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users size={14} />
                      <span>Players: 10</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity size={14} />
                      <span>FPS: 30</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Alerts */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Alerts</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-sm">No alerts at this time</p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'high'
                        ? 'bg-red-50 border-red-400'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTriangle
                            size={14}
                            className={
                              alert.severity === 'high'
                                ? 'text-red-600'
                                : alert.severity === 'medium'
                                ? 'text-yellow-600'
                                : 'text-blue-600'
                            }
                          />
                          <span className="text-xs font-medium uppercase tracking-wide">
                            {alert.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(alert.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Players</span>
                <span className="text-sm font-semibold">10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Penalties Detected</span>
                <span className="text-sm font-semibold text-red-600">
                  {alerts.filter(a => a.type === 'penalty').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fatigue Alerts</span>
                <span className="text-sm font-semibold text-yellow-600">
                  {alerts.filter(a => a.type === 'fatigue').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Injury Risks</span>
                <span className="text-sm font-semibold text-orange-600">
                  {alerts.filter(a => a.type === 'injury').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveAnalysis
