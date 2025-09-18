import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      {/* Routes with the main AppLayout (sidebar, header, etc.) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        {/* Catch-all route for any unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Standalone routes (like login, signup) */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
