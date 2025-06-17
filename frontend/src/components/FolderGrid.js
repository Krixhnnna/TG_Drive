import React from 'react';
import { Folder, FolderOpen, Star, StarBorder, People } from '@mui/icons-material';

const FolderGrid = ({ folders, files, currentView, onCreateFolder }) => {
  const [newFolderName, setNewFolderName] = React.useState('');
  const [showCreateFolder, setShowCreateFolder] = React.useState(false);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const getFoldersByView = () => {
    switch(currentView) {
      case 'favorites':
        return folders.filter(f => f.is_favorite);
      case 'shared':
        return folders.filter(f => f.is_shared);
      case 'trash':
        return folders.filter(f => f.is_trashed);
      default:
        return folders.filter(f => !f.is_trashed);
    }
  };

  const displayFolders = getFoldersByView();

  return (
    <div className="folder-grid-container">
      <div className="folder-grid-header">
        <h2>All Folders Created</h2>
        <button 
          className="create-folder-btn"
          onClick={() => setShowCreateFolder(true)}
        >
          Create New Folder
        </button>
      </div>

      {showCreateFolder && (
        <div className="create-folder-modal">
          <input
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
          />
          <button onClick={handleCreateFolder}>Create</button>
          <button onClick={() => setShowCreateFolder(false)}>Cancel</button>
        </div>
      )}

      <div className="folder-grid">
        {displayFolders.map(folder => (
          <div key={folder.id} className="folder-card">
            <div className="folder-header">
              <div className="folder-info">
                <span className="file-count">{folder.files?.length || 0} Files</span>
                <div className="folder-users">
                  <People className="users-icon" />
                  <span>{folder.shared_count || 5}</span>
                </div>
              </div>
            </div>
            
            <div className="folder-icon-container">
              <Folder className="folder-icon" />
            </div>
            
            <div className="folder-footer">
              <span className="folder-name">{folder.name}</span>
              <div className="folder-actions">
                {folder.is_favorite ? <Star className="star-icon active" /> : <StarBorder className="star-icon" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderGrid; 