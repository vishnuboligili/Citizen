import React from 'react';
import './workerHome.css';
import { jwtDecode } from 'jwt-decode';

const WorkerHome = () => {
  const token = localStorage.getItem('auth-token');
  let username = 'Worker';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.user?.name || 'Worker';
    } catch (e) {
      console.error('Invalid token');
    }
  }

  return (
    <div className="worker-home-container">
      <h1 className="welcome-text">Welcome, {username} </h1>
      <p className="worker-subtitle">
        Your dedication to resolving city issues makes a real difference. You are the hands behind a cleaner and better-managed environment. Thank you for taking charge and being a vital part of the CityZen initiative.
      </p>

      <div className="worker-home-grid">
        <div className="worker-home-card">
          <h2>🔧 My Assigned Issues</h2>
          <p>View and resolve the issues assigned to you. Keep making the city better, one fix at a time.</p>
          <button onClick={() => window.location.href = "/worker-issue"}>View My Work</button>
        </div>

        <div className="worker-home-card">
          <h2>💬 Share Your Impact</h2>
          <p>Talk to your fellow workers, share your stories, and inspire others to join CityZen!</p>
        </div>
      </div>
    </div>
  );
};

export default WorkerHome;
