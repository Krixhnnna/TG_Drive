import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { CloudUpload, Close } from '@mui/icons-material';

const UploadModal = ({ user, folders, onClose, onUploadComplete }) => {
  const [selectedFolder, setSelectedFolder] = useState(folders[0]?.id || '');
  const [uploading, setUploading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    if (!selectedFolder) {
      alert('Please select a folder');
      return;
    }

    setUploading(true);
    
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('folder_id', selectedFolder);
      formData.append('file', file);

      try {
        await axios.post('http://localhost:8000/upload', formData);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setUploading(false);
    onUploadComplete();
    onClose();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal">
        <div className="upload-modal-header">
          <h3>Upload Files</h3>
          <Close className="close-icon" onClick={onClose} />
        </div>

        <div className="folder-select">
          <label>Select Folder:</label>
          <select 
            value={selectedFolder} 
            onChange={(e) => setSelectedFolder(e.target.value)}
          >
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <CloudUpload className="upload-icon" />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>

        {uploading && (
          <div className="upload-progress">
            <p>Uploading files...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal; 