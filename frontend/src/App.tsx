import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import VideoUpload from './pages/VideoUpload'
import PlayerStats from './pages/PlayerStats'
import LiveAnalysis from './pages/LiveAnalysis'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<VideoUpload />} />
            <Route path="/stats" element={<PlayerStats />} />
            <Route path="/live" element={<LiveAnalysis />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App