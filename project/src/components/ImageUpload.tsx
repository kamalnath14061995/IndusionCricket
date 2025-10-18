import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImageUrl?: string;
  uploadEndpoint: string;
  uploadFromUrlEndpoint?: string;
  token: string;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImageUrl,
  uploadEndpoint,
  token,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Please select: ${acceptedTypes.join(', ')}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size too large. Maximum size is ${maxSizeMB}MB`;
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      onImageUpload(data.url);
      setPreviewUrl(null);
      setSelectedFile(null);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = previewUrl || currentImageUrl;

  return (
    <div className="space-y-4">
      {/* Current Image Display */}
      {displayImage && !selectedFile && (
        <div className="relative">
          <img
            src={displayImage}
            alt="Current image"
            className="max-w-xs h-32 object-cover rounded-md border border-gray-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-xs h-32 object-cover rounded-md border border-gray-300"
              />
              <button
                onClick={clearSelection}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                disabled={isUploading}
              >
                <X size={12} />
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {selectedFile?.name} ({(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={uploadFile}
                  disabled={isUploading}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <button
                  onClick={clearSelection}
                  disabled={isUploading}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <ImageIcon size={48} className="text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragOver ? 'Drop image here' : 'Upload Ground Image'}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop an image, or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max {maxSizeMB}MB • {acceptedTypes.join(', ')}
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
            >
              <Upload size={16} className="mr-2" />
              Choose File
            </button>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
              {uploadProgress > 0 && (
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2 mx-auto">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
