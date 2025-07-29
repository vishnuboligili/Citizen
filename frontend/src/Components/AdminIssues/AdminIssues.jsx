  import React, { useEffect, useState } from 'react';
  import './adminIssues.css';
  import { jwtDecode } from 'jwt-decode';

  const AdminIssues = () => {
    const [notAssignedIssues, setNotAssignedIssues] = useState([]);
    const [assignedIssues, setAssignedIssues] = useState([]);
    const [selectedIssueId, setSelectedIssueId] = useState(null);
    const [availableWorkers, setAvailableWorkers] = useState([]);
    const [selectedWorkerEmail, setSelectedWorkerEmail] = useState('');
    const [view, setView] = useState('');

    useEffect(() => {
      const token = localStorage.getItem('auth-token');
      if (!token) return window.location.replace('/login');

      try {
        const decoded = jwtDecode(token);
        if (decoded.user.role !== 'admin') {
          return window.location.replace('/');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('auth-token');
        return window.location.replace('/login');
      }
    }, []);

    const fetchAssignedIssues = async () => {
    
      try {
        const res = await fetch('http://localhost:4000/admin/issues/assigned');
        const data = await res.json();
        if (data.success) {
          setAssignedIssues(data.data);
          setNotAssignedIssues([]); // clear the other
        }
      } catch (err) {
        console.error('Error fetching assigned issues:', err);
      }
    };

    const fetchNotAssignedIssues = async () => {
      console.log(1);
      try {
        const res = await fetch('http://localhost:4000/admin/issues/notassigned');
        const data = await res.json();
        if (data.success) {
          setNotAssignedIssues(data.data);
          setAssignedIssues([]); // clear the other
        }
      } catch (err) {
        console.error('Error fetching not assigned issues:', err);
      }
    };

    const handleAssignClick = async (issue) => {
      setSelectedIssueId(issue._id);
      setSelectedWorkerEmail('');
      try {
        const res = await fetch('http://localhost:4000/admin/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pincode: issue.pincode,
            issueType: issue.category,
            address: issue.location,
          }),
        });
        const data = await res.json();
        setAvailableWorkers(data.workers || []);
      } catch (err) {
        console.error('Error fetching workers:', err);
      }
    };

    const handleAssignTo = async () => {
      console.log(selectedWorkerEmail);
      if (!selectedWorkerEmail) return;
      
      try {
        const res = await fetch('http://localhost:4000/admin/assignto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            issueId: selectedIssueId,
            workerEmail: selectedWorkerEmail,
          }),
        });
        console.log(view);
        const data = await res.json();
        if (data.success) {
          
          view === 'assigned' ? fetchAssignedIssues() : fetchNotAssignedIssues();
          setSelectedIssueId(null);
          setSelectedWorkerEmail('');
          setAvailableWorkers([]);
        }
      } catch (err) {
        console.error('Error assigning worker:', err);
      }
    };

    const handleCompleted = async (issueId) => {
      try {
        const res = await fetch('http://localhost:4000/admin/completed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ issueId }),
        });
        const data = await res.json();
        if (data.success) {
          fetchAssignedIssues();
        }
      } catch (err) {
        console.error('Error marking completed:', err);
      }
    };

    return (
      <div className="admin-issues-container">
        <h2>Admin Issues</h2>

        <div className="filter-buttons">
          <button onClick={() => { setView('notAssigned'); fetchNotAssignedIssues(); }} className={view === 'notAssigned' ? 'active' : ''}>
            Not Assigned
          </button>
          <button onClick={() => { setView('assigned'); fetchAssignedIssues(); }} className={view === 'assigned' ? 'active' : ''}>
            Assigned
          </button>
        </div>

        {view === 'notAssigned' && (
          <div className="issues-section">
            <h3>Not Assigned</h3>
            {notAssignedIssues.map(issue => (
              <div key={issue._id} className="issue-card">
                <img src={issue.image} alt="issue" className="issue-image" />
                <div className="issue-details">
                  <div><strong>Pin:</strong> {issue.pincode}</div>
                  <div><strong>Address:</strong> {issue.location}</div>
                  <div><strong>Type:</strong> {issue.category}</div>
                </div>
                <button onClick={() => handleAssignClick(issue)} className="assign-btn">Assign</button>
                {selectedIssueId === issue._id && (
                  <div className="dropdown">
                    {availableWorkers.length === 0 ? (
                      <p className="no-worker">No worker available. Please wait.</p>
                    ) : (
                      <>
                        <select
                          value={selectedWorkerEmail}
                          onChange={(e) => setSelectedWorkerEmail(e.target.value)}
                        >
                          <option value="">Select Worker</option>
                          {availableWorkers.map((worker, idx) => (
                            <option key={idx} value={worker.email}>
                              {worker.name} - {worker.email}
                            </option>
                          ))}
                        </select>
                        <button
                          className="assign-btn"
                          disabled={!selectedWorkerEmail}
                          onClick={handleAssignTo}
                        >
                          Confirm Assign
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

{view === 'assigned' && (
  <div className="issues-section">
    <h3>Assigned</h3>
    {assignedIssues.map(issue => (
      <div key={issue._id} className="issue-card">
        <img
          src={issue.afterImage ? issue.afterImage : issue.image}
          alt="issue"
          className="issue-image"
        />
        <div className="issue-details">
          <div><strong>Pin:</strong> {issue.pincode}</div>
          <div><strong>Address:</strong> {issue.location}</div>
          <div><strong>Type:</strong> {issue.category}</div>
          <div><strong>Status:</strong> {issue.status}</div>
          {issue.assignedTo && (
            <div><strong>Assigned To:</strong> {issue.assignedTo}</div>
          )}
        </div>
        {(issue.status === 'resolved' || issue.status === 'fake') && (
          <button onClick={() => handleCompleted(issue._id)} className="complete-btn">
            Completed
          </button>
        )}
      </div>
    ))}
  </div>
)}

      </div>
    );
  };

  export default AdminIssues;
