import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import FolderGrid from './FolderGrid';
import StatsBar from './StatsBar';
import UploadModal from './UploadModal';

const Dashboard = ({ user, setUser }) => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({});
  const [currentView, setCurrentView] = useState('home');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchFolders();
    fetchFiles();
    fetchStats();
  }, [user]);

  const fetchFolders = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/folders/${user.id}`);
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/files/${user.id}`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/stats/${user.id}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const createFolder = async (name) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('user_id', user.id);
      
      await axios.post('http://localhost:8000/folders/create', formData);
      fetchFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        user={user}
        setUser={setUser}
      />
      <div className="main-content">
        <Header 
          user={user}
          onCreateFolder={() => setShowUploadModal(true)}
        />
        <FolderGrid 
          folders={folders}
          files={files}
          currentView={currentView}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          onCreateFolder={createFolder}
        />
        <StatsBar stats={stats} />
      </div>
      {showUploadModal && (
        <UploadModal 
          user={user}
          folders={folders}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={() => {
            fetchFiles();
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard; 