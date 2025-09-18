import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Zap, Target, MapPin, Clock, TrendingUp } from 'lucide-react';
import Card from './ui/Card';

interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

interface RealtimeMetricsProps {
  poseLandmarks: (PoseLandmark[] | null)[];
  currentFrame: number;
  fps: number;
  courtDimensions: { width: number; height: number };
}

interface FrameMetrics {
  centerX: number;
  centerY: number;
  speed: number;
  acceleration: number;
  activityLevel: number;
  courtZone: string;
}

const RealtimeMetrics: React.FC<RealtimeMetricsProps> = ({
  poseLandmarks,
  currentFrame,
  fps,
  courtDimensions
}) => {
  const [metrics, setMetrics] = useState<FrameMetrics | null>(null);
  const [speedHistory, setSpeedHistory] = useState<number[]>([]);
  const [activityHistory, setActivityHistory] = useState<number[]>([]);

  // Calculate metrics for current frame
  const calculateFrameMetrics = useCallback((frameIndex: number): FrameMetrics | null => {
    const landmarks = poseLandmarks[frameIndex];
    if (!landmarks || landmarks.length === 0) return null;

    // Calculate center of mass
    const validLandmarks = landmarks.filter(l => l.visibility > 0.5);
    if (validLandmarks.length === 0) return null;

    const centerX = validLandmarks.reduce((sum, l) => sum + l.x, 0) / validLandmarks.length;
    const centerY = validLandmarks.reduce((sum, l) => sum + l.y, 0) / validLandmarks.length;

    // Calculate speed (pixels per second)
    let speed = 0;
    if (frameIndex > 0) {
      const prevLandmarks = poseLandmarks[frameIndex - 1];
      if (prevLandmarks && prevLandmarks.length > 0) {
        const prevValidLandmarks = prevLandmarks.filter(l => l.visibility > 0.5);
        if (prevValidLandmarks.length > 0) {
          const prevCenterX = prevValidLandmarks.reduce((sum, l) => sum + l.x, 0) / prevValidLandmarks.length;
          const prevCenterY = prevValidLandmarks.reduce((sum, l) => sum + l.y, 0) / prevValidLandmarks.length;
          
          const distance = Math.sqrt(
            Math.pow(centerX - prevCenterX, 2) + Math.pow(centerY - prevCenterY, 2)
          );
          speed = distance * fps; // pixels per second
        }
      }
    }

    // Calculate acceleration
    let acceleration = 0;
    if (speedHistory.length > 0) {
      const prevSpeed = speedHistory[speedHistory.length - 1];
      acceleration = Math.abs(speed - prevSpeed) * fps;
    }

    // Calculate activity level (based on landmark movement variance)
    const activityLevel = validLandmarks.reduce((sum, landmark) => {
      return sum + Math.abs(landmark.x - centerX) + Math.abs(landmark.y - centerY);
    }, 0) / validLandmarks.length;

    // Determine court zone
    const courtZone = getCourtZone(centerX, centerY, courtDimensions);

    return {
      centerX,
      centerY,
      speed,
      acceleration,
      activityLevel,
      courtZone
    };
  }, [poseLandmarks, fps, courtDimensions, speedHistory]);

  // Determine court zone based on position
  const getCourtZone = (x: number, y: number, dimensions: { width: number; height: number }) => {
    const normalizedX = x * dimensions.width;
    const normalizedY = y * dimensions.height;
    
    // Simplified court zones (would need actual court dimensions for accuracy)
    if (normalizedY < dimensions.height * 0.3) return "Top";
    if (normalizedY > dimensions.height * 0.7) return "Bottom";
    if (normalizedX < dimensions.width * 0.3) return "Left";
    if (normalizedX > dimensions.width * 0.7) return "Right";
    return "Center";
  };

  // Update metrics when frame changes
  useEffect(() => {
    const frameMetrics = calculateFrameMetrics(currentFrame);
    if (frameMetrics) {
      setMetrics(frameMetrics);
      
      // Update history
      setSpeedHistory(prev => [...prev.slice(-29), frameMetrics.speed]);
      setActivityHistory(prev => [...prev.slice(-29), frameMetrics.activityLevel]);
    }
  }, [currentFrame, calculateFrameMetrics]);

  // Calculate average speed over last 30 frames
  const avgSpeed = speedHistory.length > 0 
    ? speedHistory.reduce((sum, s) => sum + s, 0) / speedHistory.length 
    : 0;

  // Calculate max speed
  const maxSpeed = speedHistory.length > 0 
    ? Math.max(...speedHistory) 
    : 0;

  // Calculate activity trend
  const activityTrend = activityHistory.length > 10 
    ? activityHistory.slice(-10).reduce((sum, a) => sum + a, 0) / 10 -
      activityHistory.slice(-20, -10).reduce((sum, a) => sum + a, 0) / 10
    : 0;

  if (!metrics) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-400">
          <Activity className="h-8 w-8 mx-auto mb-2" />
          <p>Waiting for pose data...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Position */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium text-gray-300">Position</span>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-bold text-white">
            {metrics.courtZone}
          </div>
          <div className="text-xs text-gray-400">
            X: {(metrics.centerX * 100).toFixed(1)}% | Y: {(metrics.centerY * 100).toFixed(1)}%
          </div>
        </div>
      </Card>

      {/* Current Speed */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          <span className="text-sm font-medium text-gray-300">Speed</span>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-bold text-white">
            {(metrics.speed * 100).toFixed(1)} px/s
          </div>
          <div className="text-xs text-gray-400">
            Avg: {(avgSpeed * 100).toFixed(1)} | Max: {(maxSpeed * 100).toFixed(1)}
          </div>
        </div>
      </Card>

      {/* Activity Level */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Activity className="h-5 w-5 text-green-400" />
          <span className="text-sm font-medium text-gray-300">Activity</span>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-bold text-white">
            {(metrics.activityLevel * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">
            {activityTrend > 0 ? "↗ Increasing" : activityTrend < 0 ? "↘ Decreasing" : "→ Stable"}
          </div>
        </div>
      </Card>

      {/* Acceleration */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          <span className="text-sm font-medium text-gray-300">Acceleration</span>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-bold text-white">
            {(metrics.acceleration * 100).toFixed(1)} px/s²
          </div>
          <div className="text-xs text-gray-400">
            {metrics.acceleration > 0.1 ? "High" : metrics.acceleration > 0.05 ? "Medium" : "Low"}
          </div>
        </div>
      </Card>

      {/* Speed Chart */}
      <Card className="p-4 md:col-span-2">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="h-5 w-5 text-orange-400" />
          <span className="text-sm font-medium text-gray-300">Speed Over Time</span>
        </div>
        <div className="h-16 flex items-end space-x-1">
          {speedHistory.slice(-30).map((speed, index) => (
            <div
              key={index}
              className="bg-brand-orange rounded-sm flex-1"
              style={{
                height: `${Math.min(100, (speed / Math.max(maxSpeed, 0.01)) * 100)}%`,
                opacity: 0.7
              }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Last 30 frames | Current: {(metrics.speed * 100).toFixed(1)} px/s
        </div>
      </Card>

      {/* Activity Chart */}
      <Card className="p-4 md:col-span-2">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium text-gray-300">Activity Over Time</span>
        </div>
        <div className="h-16 flex items-end space-x-1">
          {activityHistory.slice(-30).map((activity, index) => (
            <div
              key={index}
              className="bg-cyan-400 rounded-sm flex-1"
              style={{
                height: `${Math.min(100, (activity / Math.max(...activityHistory, 0.01)) * 100)}%`,
                opacity: 0.7
              }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Last 30 frames | Current: {(metrics.activityLevel * 100).toFixed(1)}%
        </div>
      </Card>
    </div>
  );
};

export default RealtimeMetrics;
