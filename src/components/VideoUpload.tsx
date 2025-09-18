import React, { useState, useRef } from 'react';
import { Upload, Play, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

interface VideoUploadProps {
  onUploadSuccess: (videoId: string, safeFilename: string) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
      setUploadMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadMessage('Uploading video...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('https://basketball-api-production.up.railway.app/videos/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      setUploadStatus('success');
      setUploadMessage(`Video uploaded successfully! Video ID: ${result.video_id}`);
      onUploadSuccess(result.video_id, result.safe_filename);
      
      // Reset form
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setUploadMessage(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Upload Video for Analysis</h3>
          <p className="text-gray-400">Upload a basketball video to get AI-powered movement analysis</p>
        </div>

        {/* File Input */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-brand-orange transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <div className="p-4 bg-brand-orange/20 rounded-full">
              <Upload size={32} className="text-brand-orange" />
            </div>
            <div>
              <p className="text-white font-medium">
                {selectedFile ? selectedFile.name : 'Click to select video file'}
              </p>
              {selectedFile && (
                <p className="text-sm text-gray-400 mt-1">
                  {formatFileSize(selectedFile.size)}
                </p>
              )}
            </div>
          </label>
        </div>

        {/* Upload Button */}
        {selectedFile && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Analysis
              </>
            )}
          </Button>
        )}

        {/* Status Message */}
        {uploadMessage && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            uploadStatus === 'success' ? 'bg-green-900/20 text-green-400' :
            uploadStatus === 'error' ? 'bg-red-900/20 text-red-400' :
            uploadStatus === 'uploading' ? 'bg-blue-900/20 text-blue-400' :
            'bg-gray-800 text-gray-400'
          }`}>
            {uploadStatus === 'success' && <CheckCircle size={16} />}
            {uploadStatus === 'error' && <AlertCircle size={16} />}
            {uploadStatus === 'uploading' && <Loader size={16} className="animate-spin" />}
            <span className="text-sm">{uploadMessage}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoUpload;
