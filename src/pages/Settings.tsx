import React from 'react';
import { User, Bell, Shield, Palette } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Settings = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <p className="text-gray-400 mt-2">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-brand-orange/20 p-2 rounded-lg">
              <User size={20} className="text-brand-orange" />
            </div>
            <h3 className="text-lg font-semibold text-white">Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input 
                type="text" 
                defaultValue="Coach Morph" 
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-brand-orange focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input 
                type="email" 
                defaultValue="coach@example.com" 
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-brand-orange focus:border-brand-orange"
              />
            </div>
            <Button className="w-full">Save Changes</Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-brand-orange/20 p-2 rounded-lg">
              <Bell size={20} className="text-brand-orange" />
            </div>
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email notifications</span>
              <input type="checkbox" defaultChecked className="rounded text-brand-orange focus:ring-brand-orange" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Push notifications</span>
              <input type="checkbox" defaultChecked className="rounded text-brand-orange focus:ring-brand-orange" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">SMS alerts</span>
              <input type="checkbox" className="rounded text-brand-orange focus:ring-brand-orange" />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-brand-orange/20 p-2 rounded-lg">
              <Shield size={20} className="text-brand-orange" />
            </div>
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>
          <div className="space-y-4">
            <Button variant="outline" className="w-full">Change Password</Button>
            <Button variant="outline" className="w-full">Enable 2FA</Button>
            <Button variant="outline" className="w-full">Download Data</Button>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-brand-orange/20 p-2 rounded-lg">
              <Palette size={20} className="text-brand-orange" />
            </div>
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-brand-orange focus:border-brand-orange">
                <option>Dark</option>
                <option>Light</option>
                <option>Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-brand-orange focus:border-brand-orange">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
