import React, { useState, useEffect } from 'react';
import { FaCloudDownloadAlt, FaCloudUploadAlt, FaDatabase, FaHistory, FaTrash } from 'react-icons/fa';
import './databackup.css';
import api from '../service/api'
const DataBackup = () => {
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [backups, setBackups] = useState([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBackup, setSelectedBackup] = useState(null);


  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const response = await api.get('/api/backups/');
        setBackups(response.data);
      } catch (err) {
        setError('Failed to fetch backups');
        console.error('Error fetching backups:', err);
      }
    };

    fetchBackups();
  }, []);

  
  const handleBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    setError(null);
    
    try {
      
      const response = await api.post('/api/backups/custom_create_backup/');
      
      const pollInterval = setInterval(async () => {
        try {
          const progressResponse = await api.get(`/api/backups/status/${response.data.task_id}/`);
          
          setBackupProgress(progressResponse.data.progress);
          
          if (progressResponse.data.progress >= 100) {
            clearInterval(pollInterval);
            setIsBackingUp(false);
            
            // Refresh backup list
            const updatedResponse = await api.get('/api/backups/');
            setBackups(updatedResponse.data);
          }
        } catch (err) {
          clearInterval(pollInterval);
          setIsBackingUp(false);
          setError('Failed to check backup progress');
          console.error('Error checking backup progress:', err);
        }
      }, 1000);
    } catch (err) {
      setIsBackingUp(false);
      setError('Failed to start backup');
      console.error('Error starting backup:', err);
    }
  };

  const handleRestore = async (backupId) => {
    if (!window.confirm('Are you sure you want to restore this backup? This will overwrite current data.')) {
      return;
    }

    setIsRestoring(true);
    setRestoreProgress(0);
    setError(null);
    setSelectedBackup(backupId);
    
    try {
      // Start restore process
      const response = await api.post(`/api/backups/${backupId}/restore/`);
      
      // Poll for progress
      const pollInterval = setInterval(async () => {
        try {
          const progressResponse = await api.get(`/api/backups/status/${response.data.task_id}/`);
          
          setRestoreProgress(progressResponse.data.progress);
          
          if (progressResponse.data.progress >= 100) {
            clearInterval(pollInterval);
            setIsRestoring(false);
            setSelectedBackup(null);
            
            // Optionally show success message or refresh data
            alert('Restore completed successfully!');
          }
        } catch (err) {
          clearInterval(pollInterval);
          setIsRestoring(false);
          setSelectedBackup(null);
          setError('Failed to check restore progress');
          console.error('Error checking restore progress:', err);
        }
      }, 1000);
    } catch (err) {
      setIsRestoring(false);
      setSelectedBackup(null);
      setError('Failed to start restore');
      console.error('Error starting restore:', err);
    }
  };

  const handleDeleteBackup = async (backupId) => {
    if (!window.confirm('Are you sure you want to delete this backup?')) {
      return;
    }

    try {
      await api.delete(`/api/backups/${backupId}/`);
      setBackups(backups.filter(backup => backup.id !== backupId));
    } catch (err) {
      setError('Failed to delete backup');
      console.error('Error deleting backup:', err);
    }
  };

  return (
    <div className="bd-container">
      <h1 className="bd-title"><FaDatabase /> Data Backup</h1>
      
      {error && <div className="bd-error">{error}</div>}
      
      <div className="bd-actions">
        <div className="bd-action-card">
          <div className="bd-action-header">
            <FaCloudDownloadAlt className="bd-action-icon" />
            <h3>Create Backup</h3>
          </div>
          <p>Create a complete backup of your data</p>
          <button 
            onClick={handleBackup} 
            className="bd-button bd-backup-button"
            disabled={isBackingUp}
          >
            {isBackingUp ? `Backing Up... ${backupProgress}%` : 'Create Backup Now'}
          </button>
          {isBackingUp && (
            <div className="bd-progress-bar">
              <div 
                className="bd-progress-fill" 
                style={{ width: `${backupProgress}%` }}
              ></div>
            </div>
          )}
        </div>
        
        <div className="bd-action-card">
          <div className="bd-action-header">
            <FaCloudUploadAlt className="bd-action-icon" />
            <h3>Restore Backup</h3>
          </div>
          <p>Restore your system from a backup</p>
          <button 
            className="bd-button bd-restore-button"
            disabled={isRestoring || backups.length === 0}
          >
            {isRestoring ? `Restoring... ${restoreProgress}%` : 'Select Backup to Restore'}
          </button>
          {isRestoring && (
            <div className="bd-progress-bar">
              <div 
                className="bd-progress-fill" 
                style={{ width: `${restoreProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bd-backup-list">
        <h2 className="bd-subtitle"><FaHistory /> Backup History</h2>
        
        {backups.length === 0 ? (
          <p className="bd-no-backups">No backups available</p>
        ) : (
          <table className="bd-backup-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Size</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(backups) && backups.length > 0 ? (
  backups.map(backup => (
    <tr key={backup.id}>
      <td>{new Date(backup.created_at).toLocaleString()}</td>
      <td>{Math.round(backup.size / (1024 * 1024))} MB</td>
      <td>{backup.backup_type}</td>
      <td>
        <button 
          onClick={() => handleRestore(backup.id)}
          className="bd-action-button bd-restore-action"
          disabled={isRestoring && selectedBackup === backup.id}
        >
          <FaCloudUploadAlt /> Restore
        </button>
        <button 
          onClick={() => handleDeleteBackup(backup.id)}
          className="bd-action-button bd-delete-action"
          disabled={isRestoring}
        >
          <FaTrash /> Delete
        </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
      No backups found
    </td>
  </tr>
)}

            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataBackup;