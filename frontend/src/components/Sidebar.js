import React from 'react';
import { 
  Home, 
  Cloud, 
  People, 
  Star, 
  Delete, 
  Help, 
  Settings, 
  AccountCircle 
} from '@mui/icons-material';

const Sidebar = ({ currentView, setCurrentView, user, setUser }) => {
  const menuItems = [
    { id: 'home', icon: <Home />, label: 'Home' },
    { id: 'mycloud', icon: <Cloud />, label: 'My Cloud' },
    { id: 'shared', icon: <People />, label: 'Shared Files' },
    { id: 'favorites', icon: <Star />, label: 'Favourites' },
    { id: 'trash', icon: <Delete />, label: 'Trash Box' },
  ];

  const bottomItems = [
    { id: 'help', icon: <Help />, label: 'Help' },
    { id: 'settings', icon: <Settings />, label: 'Settings' },
    { id: 'account', icon: <AccountCircle />, label: 'Account' },
  ];

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Cloud className="logo-icon" />
          <span>Cloud Box</span>
        </div>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map(item => (
          <div 
            key={item.id}
            className={`menu-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        {bottomItems.map(item => (
          <div 
            key={item.id}
            className="menu-item"
            onClick={() => item.id === 'account' ? logout() : setCurrentView(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 