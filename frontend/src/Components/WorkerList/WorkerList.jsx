import React, { useEffect, useState } from 'react';
import imageIcon from '../../Assets/profile.jpg';
import './WorkerList.css';
import { jwtDecode } from 'jwt-decode';

const WorkerList = () => {
  const [workers, setWorkers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');

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

    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch('http://localhost:4000/admin/workerlist');
      const data = await res.json();
      if (data.success) setWorkers(data.data);
      else console.error(data.message);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const handleRemoveWorker = async (workerId) => {
    if (!window.confirm("Are you sure you want to remove this worker?")) return;

    try {
      const res = await fetch("http://localhost:4000/admin/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: workerId, role: 'user', workerType: 'a' })
      });

      const responseData = await res.json();
      if (!responseData.success) console.log(responseData.message);
      fetchWorkers();
    } catch (error) {
      console.error('Error updating worker:', error);
    }
  };

  const filteredWorkers = workers.filter(worker =>
    worker.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="workerlist-container">
      <h2>Worker List</h2>

      <input
        type="text"
        placeholder="Search by email"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        className="search-input"
      />

      <div className="worker-list">
        {filteredWorkers.map(worker => (
          <div key={worker._id} className="worker-card">
            <div className="worker-info">
              <img
                src={worker.profile || imageIcon}
                alt="profile"
                className="worker-image"
              />
              <div>
                <div className="worker-name">{worker.name}</div>
                <div className="worker-email">{worker.email}</div>
                <div className="worker-role">Role: {worker.role}</div>
                <div className="worker-type">Type: {worker.workerType || 'N/A'}</div>
                <div className="worker-region">Region: {worker.region || 'N/A'}</div>
                <div className="worker-pincode">Pincode: {worker.pincode || 'N/A'}</div>
              </div>
            </div>

            <div className="worker-action">
              <button
                onClick={() => handleRemoveWorker(worker._id)}
                className="remove-worker-button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkerList;
