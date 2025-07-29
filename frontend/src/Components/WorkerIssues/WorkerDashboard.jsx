import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './WorkerDashboard.css';
import defaultUploadIcon from '../../Assets/upload_area.svg';

const WorkerDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [workerEmail, setWorkerEmail] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', image: null });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      const decoded = jwtDecode(token);
      const email = decoded.user.email;
      setWorkerEmail(email);
      fetchAssignedIssues(email);
    }
  }, []);

  const fetchAssignedIssues = async (email) => {
    try {
      const res = await fetch('http://localhost:4000/worker/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setIssues(data.data);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
    }
  };

  const handleProgress = async (issueId) => {
    try {
      const res = await fetch('http://localhost:4000/worker/issues/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: workerEmail,
          issueId,
          status: 'progress',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAssignedIssues(workerEmail);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleOpenForm = (issue, statusType) => {
    setSelectedIssue(issue);
    setStatusForm({ status: statusType, image: null });
    setPreviewUrl(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStatusForm({ ...statusForm, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitStatus = async (e) => {
    e.preventDefault();
    if (!selectedIssue || !statusForm.image) return;
    const imageData = new FormData();
    let imageUrl;
  
    imageData.append('image', statusForm.image);
    try {
        const response = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          body: imageData
        });
        const data = await response.json();
    
        if (data.success) {
          imageUrl = data.image_url;
        } else {
          console.log(data.message)
          return;
        }
      } catch (err) {
        console.error("Image upload error:", err);
        
        return;
      }
    
    const data = {
        email: workerEmail,
        issueId: selectedIssue._id,
        status: statusForm.status,
        afterImage: imageUrl
      };
    console.log(data);
    try {
        const res = await fetch('http://localhost:4000/worker/issues/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',  // 👈 THIS LINE IS REQUIRED
            },
            body: JSON.stringify(data),
          });
          
      const response = await res.json();
      if (response.success) {
        setSelectedIssue(null);
        setPreviewUrl(null);
        fetchAssignedIssues(workerEmail);
        
      } else {
        console.log(response.message);
      }
    } catch (err) {
      console.error('Error submitting status:', err);
    }
  };

  return (
    <div className="worker-dashboard">
      <h2>My Assigned Issues</h2>

      {issues.map((issue) => (
        <div key={issue._id} className="issue-card">
          <img src={issue.image} alt="Issue" className="issue-image" />
          <div className="issue-info">
            <div><strong>Address:</strong> {issue.location}</div>
            <div><strong>Pincode:</strong> {issue.pincode}</div>
          </div>
          <div className="action-buttons">
            <button onClick={() => handleProgress(issue._id)}>On Progress</button>
            <button onClick={() => handleOpenForm(issue, 'fake')}>Fake</button>
            <button onClick={() => handleOpenForm(issue, 'resolved')}>Resolved</button>
          </div>
        </div>
      ))}

      {selectedIssue && (
        <div className="status-form">
          <h3>Submit {statusForm.status.charAt(0).toUpperCase() + statusForm.status.slice(1)} Status</h3>
          <form onSubmit={handleSubmitStatus}>
            <div className="image-upload-container">
              <label htmlFor="fileInput">
                <div className="image-preview-box">
                  <img
                    src={previewUrl || defaultUploadIcon}
                    alt="Preview"
                    className="preview-image"
                  />
                </div>
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                required
              />
            </div>

            <button type="submit">Submit</button>
            <button
              type="button"
              onClick={() => {
                setSelectedIssue(null);
                setPreviewUrl(null);
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
