import React from 'react';
import './adminHome.css';
import { jwtDecode } from 'jwt-decode';

const AdminHome = () => {
  const token = localStorage.getItem('auth-token');
  let username = 'Admin';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.user?.name || 'Admin';
    } catch (e) {
      console.error('Invalid token');
    }
  }

  return (
    <div className="admin-home-container">
      <h1 className="welcome-text">Welcome, {username} 🧠</h1>
      <p className="admin-subtitle">
        As the backbone of CityZen, your role is crucial in ensuring transparency, efficiency, and accountability in civic operations. Thank you for overseeing the engine that powers positive change.
      </p>

      <div className="admin-home-grid">
        <div className="admin-home-card">
          <h2>📊 All Issues</h2>
          <p>Review all reported issues, monitor their statuses, and assign workers as needed.</p>
          <button onClick={() => window.location.href = "/admin-issue"}>Manage Issues</button>
        </div>

        <div className="admin-home-card">
          <h2>👷 All Workers</h2>
          <p>View and manage workers involved in resolving issues across the city.</p>
          <button onClick={() => window.location.href = "/users-list"}>View Workers</button>
        </div>

        <div className="admin-home-card">
          <h2>🧍 All Users</h2>
          <p>Access and manage the citizens who are actively using the platform to raise concerns.</p>
          <button onClick={() => window.location.href = "/workers-list"}>View Users</button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
