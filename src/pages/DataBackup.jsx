import React, { useState } from 'react';
import { FaCloudDownloadAlt, FaCloudUploadAlt, FaDatabase, FaHistory, FaTrash } from 'react-icons/fa';
import './databackup.css';

const DataBackup = () => {
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [backups, setBackups] = useState([
    { id: 1, date: '2023-05-15 14:30', size: '45 MB', type: 'Full' },
    { id: 2, date: '2023-05-14 09:15', size: '12 MB', type: 'Partial' },
    { id: 3, date: '2023-05-10 18:45', size: '42 MB', type: 'Full' },
  ]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          // Add new backup to list
          const newBackup = {
            id: backups.length + 1,
            date: new Date().toLocaleString(),
            size: `${Math.floor(Math.random() * 50) + 10} MB`,
            type: 'Full'
          };
          setBackups([newBackup, ...backups]);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleRestore = (id) => {
    setIsRestoring(true);
    setRestoreProgress(0);
    
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoring(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDeleteBackup = (id) => {
    if (window.confirm('Are you sure you want to delete this backup?')) {
      setBackups(backups.filter(backup => backup.id !== id));
    }
  };

  return (
    <div className="bd-container">
      <h1 className="bd-title"><FaDatabase /> Data Backup</h1>
      
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
              {backups.map(backup => (
                <tr key={backup.id}>
                  <td>{backup.date}</td>
                  <td>{backup.size}</td>
                  <td>{backup.type}</td>
                  <td>
                    <button 
                      onClick={() => handleRestore(backup.id)}
                      className="bd-action-button bd-restore-action"
                    >
                      <FaCloudUploadAlt /> Restore
                    </button>
                    <button 
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="bd-action-button bd-delete-action"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataBackup;