import React from 'react';
import { TrendingUp, Users, Target, Award } from 'lucide-react';
import Card from '../components/ui/Card';

const Analytics = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Analytics</h2>
        <p className="text-gray-400 mt-2">Performance insights and statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Sessions</p>
              <p className="text-2xl font-bold text-white mt-1">24</p>
            </div>
            <div className="bg-brand-orange/20 p-3 rounded-full">
              <TrendingUp size={24} className="text-brand-orange" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Players</p>
              <p className="text-2xl font-bold text-white mt-1">12</p>
            </div>
            <div className="bg-brand-orange/20 p-3 rounded-full">
              <Users size={24} className="text-brand-orange" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Accuracy Rate</p>
              <p className="text-2xl font-bold text-white mt-1">94.2%</p>
            </div>
            <div className="bg-brand-orange/20 p-3 rounded-full">
              <Target size={24} className="text-brand-orange" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Top Performer</p>
              <p className="text-2xl font-bold text-white mt-1">#23</p>
            </div>
            <div className="bg-brand-orange/20 p-3 rounded-full">
              <Award size={24} className="text-brand-orange" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Trends</h3>
          <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Chart placeholder - Performance over time</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Player Distribution</h3>
          <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Chart placeholder - Player stats distribution</p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <Card className="p-6">
          <div className="space-y-4">
            {[
              { action: "Session completed", player: "Player #23", time: "2 hours ago", type: "success" },
              { action: "Penalty detected", player: "Player #15", time: "3 hours ago", type: "warning" },
              { action: "Fatigue alert", player: "Player #8", time: "4 hours ago", type: "info" },
              { action: "New session started", player: "Coach Morph", time: "5 hours ago", type: "info" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                <div>
                  <p className="text-white">{activity.action}</p>
                  <p className="text-sm text-gray-400">{activity.player} • {activity.time}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  activity.type === 'success' ? 'bg-green-900 text-green-300' :
                  activity.type === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-blue-900 text-blue-300'
                }`}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
