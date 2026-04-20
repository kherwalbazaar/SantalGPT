import { useState } from 'react';
import { Upload, FileText, Trash2, X } from 'lucide-react';

const DocumentUpload = ({ onUploadSuccess, documents, onClearDocuments }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
      setUploadStatus({ type: 'error', message: 'Please upload PDF or TXT files only' });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/upload-document`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const data = await response.json();
      setUploadStatus({ type: 'success', message: data.message });
      onUploadSuccess();
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Error uploading document' });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearDocuments = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear documents');
      }

      setUploadStatus({ type: 'success', message: 'All documents cleared' });
      onClearDocuments();
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Error clearing documents' });
      console.error('Clear error:', error);
    }
  };

  const documentCount = Object.keys(documents || {}).length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Upload
        </h3>
        {documentCount > 0 && (
          <button
            onClick={handleClearDocuments}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block w-full">
          <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF or TXT files</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
        </label>
      </div>

      {uploadStatus && (
        <div className={`p-3 rounded-lg mb-4 ${
          uploadStatus.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {uploadStatus.type === 'success' ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-red-600">✗</span>
            )}
            <span className="text-sm">{uploadStatus.message}</span>
            <button
              onClick={() => setUploadStatus(null)}
              className="ml-auto hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {documentCount > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Uploaded Documents ({documentCount})
          </p>
          <div className="space-y-2">
            {Object.entries(documents || {}).map(([filename, chunks]) => (
              <div
                key={filename}
                className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">
                    {filename}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {chunks} chunks
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
