import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

interface VideoPlayerProps {
  videoUrl: string;
  poseLandmarks: (PoseLandmark[] | null)[];
  fps: number;
  onTimeUpdate?: (currentTime: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  poseLandmarks, 
  fps, 
  onTimeUpdate 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showPose, setShowPose] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Calculate current frame based on video time
  const getCurrentFrame = useCallback((time: number) => {
    return Math.floor(time * fps);
  }, [fps]);

  // Draw pose landmarks on canvas
  const drawPose = useCallback((landmarks: PoseLandmark[] | null) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !landmarks) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw pose landmarks
    ctx.strokeStyle = '#FF7A00';
    ctx.fillStyle = '#FF7A00';
    ctx.lineWidth = 2;

    // Draw skeleton connections (simplified pose structure)
    const connections = [
      // Head to shoulders
      [0, 1], [0, 4],
      // Shoulders to elbows
      [11, 12], [12, 14], [14, 16],
      [11, 13], [13, 15], [15, 17],
      // Torso
      [11, 23], [12, 24], [23, 24],
      // Hips to knees
      [23, 25], [25, 27], [27, 29], [29, 31],
      [24, 26], [26, 28], [28, 30], [30, 32],
      // Feet
      [27, 31], [28, 32]
    ];

    // Draw connections
    connections.forEach(([start, end]) => {
      if (landmarks[start] && landmarks[end] && 
          landmarks[start].visibility > 0.5 && landmarks[end].visibility > 0.5) {
        ctx.beginPath();
        ctx.moveTo(
          landmarks[start].x * canvas.width, 
          landmarks[start].y * canvas.height
        );
        ctx.lineTo(
          landmarks[end].x * canvas.width, 
          landmarks[end].y * canvas.height
        );
        ctx.stroke();
      }
    });

    // Draw landmarks as dots
    landmarks.forEach((landmark, index) => {
      if (landmark.visibility > 0.5) {
        ctx.beginPath();
        ctx.arc(
          landmark.x * canvas.width, 
          landmark.y * canvas.height, 
          3, 0, 2 * Math.PI
        );
        ctx.fill();
      }
    });
  }, []);

  // Handle video time update
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    
    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    
    const frame = getCurrentFrame(time);
    setCurrentFrame(frame);
    
    // Draw pose for current frame
    if (showPose && poseLandmarks[frame]) {
      drawPose(poseLandmarks[frame]);
    }
    
    onTimeUpdate?.(time);
  }, [getCurrentFrame, poseLandmarks, showPose, drawPose, onTimeUpdate]);

  // Video event handlers
  const handlePlay = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [handleTimeUpdate]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Video Container */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-auto"
            preload="metadata"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
          />
          
          {/* Overlay Controls */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              size="sm"
              variant={showPose ? "primary" : "secondary"}
              onClick={() => setShowPose(!showPose)}
            >
              {showPose ? "Hide Pose" : "Show Pose"}
            </Button>
          </div>
        </div>

        {/* Video Controls */}
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-400 w-12">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-brand-orange h-2 rounded-full transition-all duration-150"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-400 w-12">
              {formatTime(duration)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleSeek(Math.max(0, currentTime - 10))}
              >
                <SkipBack size={16} />
              </Button>
              
              <Button
                size="sm"
                onClick={isPlaying ? handlePause : handlePlay}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </Button>
              
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
              >
                <SkipForward size={16} />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </Button>
              
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-400 w-8">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Frame Info */}
        <div className="text-center text-sm text-gray-400">
          Frame: {currentFrame} / {poseLandmarks.length} | 
          Time: {formatTime(currentTime)} / {formatTime(duration)} | 
          FPS: {fps.toFixed(1)}
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
