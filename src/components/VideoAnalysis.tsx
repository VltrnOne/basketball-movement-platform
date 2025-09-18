import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Play, BarChart3, MapPin, Clock, CheckCircle, Loader, Video } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import VideoPlayer from './VideoPlayer';
import RealtimeMetrics from './RealtimeMetrics';

interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

interface BasketballMetrics {
  // Core Movement Metrics
  total_distance_covered: number;
  average_speed: number;
  max_speed: number;
  high_intensity_sprints: number;
  
  // Trajectory Analysis
  court_coverage_percentage: number;
  movement_efficiency: number;
  
  // Court Zone Distribution
  court_zone_distribution: {
    paint: number;
    mid_range: number;
    three_point: number;
    baseline: number;
  };
  paint_time_percentage: number;
  three_point_time_percentage: number;
  
  // Performance Indicators
  acceleration_events: number;
  direction_changes: number;
}

interface VideoAnalysisData {
  video_id: string;
  status: string;
  total_frames: number;
  processed_frames: number;
  pose_landmarks: (PoseLandmark[] | null)[];
  basketball_metrics: BasketballMetrics;
  analysis_metadata: {
    model_version: string;
    analysis_duration: number;
    court_dimensions: { width: number; height: number };
    fps: number;
  };
}

interface VideoAnalysisProps {
  videoId: string;
  safeFilename?: string | null;
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({ videoId, safeFilename }) => {
  const [analysis, setAnalysis] = useState<VideoAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'movement' | 'trajectory'>('movement');
  const [viewMode, setViewMode] = useState<'charts' | 'playback'>('charts');
  const [currentFrame, setCurrentFrame] = useState(0);

  // Calculate video URL using the safe filename from upload
  const videoUrl = analysis && safeFilename ? `https://basketball-api-production.up.railway.app/uploads/${safeFilename}` : '';

  // Calculate current frame from time
  const calculateCurrentFrame = useCallback((time: number) => {
    if (!analysis) return 0;
    return Math.floor(time * analysis.analysis_metadata.fps);
  }, [analysis]);

  // Handle video time updates
  const handleTimeUpdate = useCallback((time: number) => {
    const frame = calculateCurrentFrame(time);
    setCurrentFrame(frame);
  }, [calculateCurrentFrame]);

  const fetchAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
          const response = await fetch(`https://basketball-api-production.up.railway.app/videos/${videoId}/analysis`);

      if (!response.ok) {
        throw new Error(`Failed to fetch analysis: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis');
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  const checkStatus = useCallback(async () => {
    try {
          const response = await fetch(`https://basketball-api-production.up.railway.app/videos/${videoId}/status`);
      const status = await response.json();
      
      if (status.status === 'completed') {
        fetchAnalysis();
      } else {
        // If still processing, check again in 2 seconds
        setTimeout(checkStatus, 2000);
      }
    } catch (err) {
      console.error('Error checking status:', err);
      setError('Failed to check analysis status');
    }
  }, [videoId, fetchAnalysis]);

  useEffect(() => {
    // Start by checking status instead of immediately fetching analysis
    checkStatus();
  }, [videoId, checkStatus]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-3">
          <Loader className="h-6 w-6 animate-spin text-brand-orange" />
          <span className="text-white">Processing video with AI pose estimation...</span>
        </div>
        <div className="mt-4 text-center">
          <Button onClick={checkStatus} variant="secondary" size="sm">
            Check Status
          </Button>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-400">
          <p>Error: {error}</p>
          <Button onClick={fetchAnalysis} variant="secondary" className="mt-4">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-400">
          <p>No analysis data available</p>
        </div>
      </Card>
    );
  }

  // Prepare data for charts from pose landmarks
  const movementData = analysis.pose_landmarks
    .map((landmarks, index) => {
      if (!landmarks || landmarks.length === 0) {
        return null; // Skip null frames
      }
      
      // Calculate center of mass (average of all landmarks)
      const centerX = landmarks.reduce((sum, landmark) => sum + landmark.x, 0) / landmarks.length;
      const centerY = landmarks.reduce((sum, landmark) => sum + landmark.y, 0) / landmarks.length;
      const avgConfidence = landmarks.reduce((sum, landmark) => sum + landmark.visibility, 0) / landmarks.length;
      
      return {
        frame: index,
        timestamp: index / analysis.analysis_metadata.fps, // Convert frame to timestamp
        x: centerX,
        y: centerY,
        confidence: avgConfidence
      };
    })
    .filter(data => data !== null); // Remove null frames

  const trajectoryData = movementData.map(movement => ({
    x: movement.x,
    y: movement.y,
    confidence: movement.confidence
  }));

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Analysis Complete</h3>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'charts' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('charts')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Charts
            </Button>
            <Button
              variant={viewMode === 'playback' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('playback')}
            >
              <Video className="mr-2 h-4 w-4" />
              Playback
            </Button>
          </div>
        </div>

        {/* Analysis Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-brand-orange" />
              <span className="text-sm text-gray-400">Total Frames</span>
            </div>
            <p className="text-2xl font-bold text-white">{analysis.total_frames}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Processed</span>
            </div>
            <p className="text-2xl font-bold text-white">{analysis.processed_frames}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Duration</span>
            </div>
            <p className="text-2xl font-bold text-white">{analysis.analysis_metadata.analysis_duration}s</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-400">FPS</span>
            </div>
            <p className="text-2xl font-bold text-white">{analysis.analysis_metadata.fps}</p>
          </div>
        </div>
      </Card>

      {/* MVP Basketball Metrics */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-white mb-4">🏀 MVP Basketball Metrics</h4>
        
        {/* Core Movement Metrics */}
        <div className="mb-6">
          <h5 className="text-md font-semibold text-gray-300 mb-3">Core Movement Metrics</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-brand-orange">{analysis.basketball_metrics.total_distance_covered} ft</div>
              <div className="text-sm text-gray-400">Total Distance Covered</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{analysis.basketball_metrics.average_speed} mph</div>
              <div className="text-sm text-gray-400">Average Speed</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{analysis.basketball_metrics.max_speed} mph</div>
              <div className="text-sm text-gray-400">Max Speed</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{analysis.basketball_metrics.high_intensity_sprints}</div>
              <div className="text-sm text-gray-400">High-Intensity Sprints</div>
            </div>
          </div>
        </div>
        
        {/* Trajectory Analysis */}
        <div className="mb-6">
          <h5 className="text-md font-semibold text-gray-300 mb-3">Trajectory Analysis</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{analysis.basketball_metrics.court_coverage_percentage}%</div>
              <div className="text-sm text-gray-400">Court Coverage</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-cyan-400">{analysis.basketball_metrics.movement_efficiency}%</div>
              <div className="text-sm text-gray-400">Movement Efficiency</div>
            </div>
          </div>
        </div>
        
        {/* Court Zone Analysis */}
        <div className="mb-6">
          <h5 className="text-md font-semibold text-gray-300 mb-3">Court Zone Analysis</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-lg font-semibold text-white mb-2">Zone Distribution</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Paint:</span>
                  <span className="text-brand-orange">{analysis.basketball_metrics.paint_time_percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Mid-Range:</span>
                  <span className="text-green-400">{analysis.basketball_metrics.court_zone_distribution.mid_range.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">3-Point:</span>
                  <span className="text-blue-400">{analysis.basketball_metrics.three_point_time_percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Baseline:</span>
                  <span className="text-purple-400">{analysis.basketball_metrics.court_zone_distribution.baseline.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-lg font-semibold text-white mb-2">Performance Indicators</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Acceleration Events:</span>
                  <span className="text-red-400">{analysis.basketball_metrics.acceleration_events}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Direction Changes:</span>
                  <span className="text-orange-400">{analysis.basketball_metrics.direction_changes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Conditional Content Based on View Mode */}
      {viewMode === 'charts' ? (
        <>
          {/* Chart Type Toggle */}
          <Card className="p-4">
            <div className="flex justify-center space-x-2">
              <Button
                variant={chartType === 'movement' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setChartType('movement')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Movement
              </Button>
              <Button
                variant={chartType === 'trajectory' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setChartType('trajectory')}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Trajectory
              </Button>
            </div>
          </Card>

          {/* Charts */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              {chartType === 'movement' ? 'Player Movement Over Time' : 'Court Trajectory'}
            </h4>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'movement' ? (
                  <LineChart data={movementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="frame" 
                      stroke="#9CA3AF"
                      label={{ value: 'Frame', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="x" 
                      stroke="#FF7A00" 
                      strokeWidth={2}
                      name="X Position"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Y Position"
                    />
                  </LineChart>
                ) : (
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      domain={[0, analysis.analysis_metadata.court_dimensions.width]}
                      stroke="#9CA3AF"
                      label={{ value: 'X Position', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      domain={[0, analysis.analysis_metadata.court_dimensions.height]}
                      stroke="#9CA3AF"
                      label={{ value: 'Y Position', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Scatter 
                      data={trajectoryData} 
                      fill="#FF7A00"
                      name="Player Position"
                    />
                  </ScatterChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* Video Player with Pose Overlay */}
          <VideoPlayer
            videoUrl={videoUrl}
            poseLandmarks={analysis.pose_landmarks}
            fps={analysis.analysis_metadata.fps}
            onTimeUpdate={handleTimeUpdate}
          />

          {/* Real-time Metrics */}
          <RealtimeMetrics
            poseLandmarks={analysis.pose_landmarks}
            currentFrame={currentFrame}
            fps={analysis.analysis_metadata.fps}
            courtDimensions={analysis.analysis_metadata.court_dimensions}
          />
        </>
      )}
    </div>
  );
};

export default VideoAnalysis;
