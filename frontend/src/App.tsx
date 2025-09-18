import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      {/* Routes with the main AppLayout (sidebar, header, etc.) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        {/* Add other main app routes here */}
        {/* <Route path="/sessions" element={<SessionsPage />} /> */}
      </Route>

      {/* Standalone routes (like login, signup) */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;