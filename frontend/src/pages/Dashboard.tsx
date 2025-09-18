import React from 'react';
import { Upload, Camera, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="p-8 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
        <h2 className="text-3xl font-bold">Welcome Back, Coach!</h2>
        <p className="mt-2 text-orange-100">Ready to analyze the next big game? Let's get started.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          icon={<Upload size={24} />}
          title="Upload Game Video"
          description="Analyze a pre-recorded game for deep insights."
        />
        <ActionCard
          icon={<Camera size={24} />}
          title="Start Live Analysis"
          description="Capture real-time data directly from the sideline."
        />
      </div>

      {/* Stats Overview */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Last Session Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Play Time" value="48:00 mins" />
          <StatCard title="Fatigue Alerts" value="3" />
          <StatCard title="Penalties Detected" value="8" />
          <StatCard title="Top Performer" value="Player #23" />
        </div>
      </div>
    </div>
  );
};

// Helper components for cards
const ActionCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <Card hover className="p-6 flex items-center space-x-6">
    <div className="bg-orange-500/20 p-4 rounded-full text-orange-500">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-lg">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
    <ArrowRight size={20} className="text-gray-500" />
  </Card>
);

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <Card className="p-6">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-2xl font-bold mt-1 text-white">{value}</p>
  </Card>
);

export default Dashboard;