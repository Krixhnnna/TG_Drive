import React from 'react';
import { Search, Notifications, Link as LinkIcon } from '@mui/icons-material';

const Header = ({ user, onCreateFolder }) => {
  return (
    <div className="header">
      <div className="search-container">
        <Search className="search-icon" />
        <input 
          type="text" 
          placeholder="Search Any thing Here" 
          className="search-input"
        />
      </div>
      
      <div className="storage-info">
        <div className="storage-bar">
          <div className="storage-label">Storage</div>
          <div className="storage-usage">65% used</div>
          <div className="storage-details">6.5GB of 10GB used</div>
          <div className="storage-progress">
            <div className="progress-bar" style={{width: '65%'}}></div>
          </div>
        </div>
        <button className="upgrade-btn">Upgrade Plan</button>
      </div>

      <div className="header-actions">
        <div className="notifications">
          <Notifications />
          <span className="notification-count">6 New</span>
        </div>
        <div className="link-icon">
          <LinkIcon />
        </div>
      </div>
    </div>
  );
};

export default Header; 