import { useState } from 'react';
import { Play, Upload, Calendar, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import VideoUpload from '../components/VideoUpload';
import VideoAnalysis from '../components/VideoAnalysis';

const Sessions = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentSafeFilename, setCurrentSafeFilename] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleUploadSuccess = (videoId: string, safeFilename: string) => {
    setCurrentVideoId(videoId);
    setCurrentSafeFilename(safeFilename);
    setShowAnalysis(true);
    setShowUpload(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Sessions</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowUpload(true)}
            className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Upload Video
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
            New Session
          </button>
        </div>
      </div>

      {/* Video Upload Section */}
      {showUpload && (
        <VideoUpload onUploadSuccess={handleUploadSuccess} />
      )}

      {/* Video Analysis Section */}
      {showAnalysis && currentVideoId && (
        <VideoAnalysis videoId={currentVideoId} safeFilename={currentSafeFilename} />
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cursor-pointer" onClick={() => setShowUpload(true)}>
          <Card className="p-6 hover:bg-gray-800 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-brand-orange/20 p-3 rounded-full">
                <Play size={24} className="text-brand-orange" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Start Live Session</h3>
                <p className="text-gray-400 text-sm">Begin real-time analysis</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="cursor-pointer" onClick={() => setShowUpload(true)}>
          <Card className="p-6 hover:bg-gray-800 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-brand-orange/20 p-3 rounded-full">
                <Upload size={24} className="text-brand-orange" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Upload Video</h3>
                <p className="text-gray-400 text-sm">Analyze recorded footage</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Recent Sessions</h3>
        <div className="space-y-4">
          {[
            { id: 1, name: "Practice Session #1", date: "2024-01-15", duration: "45:30", status: "Completed" },
            { id: 2, name: "Game Analysis", date: "2024-01-14", duration: "32:15", status: "In Progress" },
            { id: 3, name: "Training Session", date: "2024-01-13", duration: "28:45", status: "Completed" },
          ].map((session) => (
            <Card key={session.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-white">{session.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                    <span className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {session.date}
                    </span>
                    <span className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {session.duration}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  session.status === 'Completed' 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {session.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
