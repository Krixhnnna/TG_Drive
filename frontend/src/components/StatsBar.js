import React from 'react';
import { 
  Description, 
  Folder, 
  Delete, 
  Star, 
  Share, 
  FolderShared 
} from '@mui/icons-material';

const StatsBar = ({ stats }) => {
  const statItems = [
    {
      icon: <Description className="stat-icon blue" />,
      label: 'Files Added:',
      value: stats.files_added || 225,
      color: 'blue'
    },
    {
      icon: <Delete className="stat-icon red" />,
      label: 'No.of Trash Files:',
      value: stats.trash_files || 25,
      color: 'red'
    },
    {
      icon: <Share className="stat-icon blue" />,
      label: 'Files Shared:',
      value: stats.files_shared || 150,
      color: 'blue'
    },
    {
      icon: <Folder className="stat-icon blue" />,
      label: 'Folders Created:',
      value: stats.folders_created || 25,
      color: 'blue'
    },
    {
      icon: <Star className="stat-icon yellow" />,
      label: 'No.of Favourites:',
      value: stats.favorites || 57,
      color: 'yellow'
    },
    {
      icon: <FolderShared className="stat-icon blue" />,
      label: 'Folders Shared:',
      value: stats.folders_shared || 6,
      color: 'blue'
    }
  ];

  return (
    <div className="stats-bar">
      {statItems.map((item, index) => (
        <div key={index} className="stat-item">
          {item.icon}
          <div className="stat-content">
            <span className="stat-label">{item.label}</span>
            <span className="stat-value">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar; 