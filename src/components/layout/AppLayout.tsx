import React from 'react';
import { LayoutDashboard, Video, BarChart3, Settings } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-brand-dark">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          <span className="text-brand-orange">B-Ball</span> AI
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} active={true}>Dashboard</NavItem>
          <NavItem icon={<Video size={20} />} active={false}>Sessions</NavItem>
          <NavItem icon={<BarChart3 size={20} />} active={false}>Analytics</NavItem>
          <NavItem icon={<Settings size={20} />} active={false}>Settings</NavItem>
        </nav>
        <div className="p-4 border-t border-gray-700">
          {/* User Profile Section */}
          <div className="flex items-center">
            <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" />
            <div className="ml-3">
              <p className="text-sm font-medium">Coach Morph</p>
              <p className="text-xs text-gray-400">View Profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-900/50 p-6 border-b border-gray-700">
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// Helper component for navigation items
const NavItem = ({ icon, active, children }: { icon: React.ReactNode; active: boolean; children: React.ReactNode }) => {
  const activeClass = "bg-brand-orange text-white";
  const inactiveClass = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <div
      className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
        active ? activeClass : inactiveClass
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{children}</span>
    </div>
  );
};

export default AppLayout;
