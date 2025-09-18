import React, { useState } from 'react'
import { Upload, FileVideo, CheckCircle, AlertCircle } from 'lucide-react'

const VideoUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      setUploadStatus('error')
      return
    }

    // Validate file size (max 2GB)
    if (file.size > 2 * 1024 * 1024 * 1024) {
      setUploadStatus('error')
      return
    }

    setUploadStatus('uploading')
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus('success')
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Video</h1>
        <p className="text-gray-600 mt-2">Upload basketball game footage for analysis</p>
      </div>

      <div className="card">
        <div
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-basketball-orange bg-orange-50'
              : uploadStatus === 'success'
              ? 'border-green-400 bg-green-50'
              : uploadStatus === 'error'
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="video/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploadStatus === 'uploading'}
          />

          {uploadStatus === 'idle' && (
            <div>
              <FileVideo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your video file here, or click to browse
              </p>
              <p className="text-sm text-gray-600">
                Supports MP4, MOV, AVI up to 2GB
              </p>
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div>
              <Upload className="w-12 h-12 text-basketball-orange mx-auto mb-4 animate-pulse" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Uploading video...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-basketball-orange h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload successful!
              </p>
              <p className="text-sm text-gray-600">
                Your video is being processed for analysis
              </p>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div>
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload failed
              </p>
              <p className="text-sm text-gray-600">
                Please check your file format and size, then try again
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Guidelines */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Guidelines</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start space-x-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Supported formats: MP4, MOV, AVI, MKV</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Maximum file size: 2GB</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Recommended resolution: 1080p or higher</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Ensure good lighting and clear view of players</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Processing time: 2-5 minutes per hour of footage</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default VideoUpload
