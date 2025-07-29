import React from 'react';
import './userHome.css';
import { jwtDecode } from 'jwt-decode';

const UserHome = () => {
  const token = localStorage.getItem('auth-token');
  let username = 'Citizen';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.user?.name || 'Citizen';
    } catch (e) {
      console.error('Invalid token');
    }
  }

  return (
    <div className="user-home">
      <h1 className="welcome-msg">Welcome, {username} 🌟</h1>
      <p className="appreciation-msg">
        Thank you for taking responsibility for your surroundings. Your voice matters, and your reports help make our city better every day. 
        Together, we can fix what’s broken and celebrate the spirit of community engagement!
      </p>

      <div className="user-actions">
        <div className="action-card">
          <h2>📢 Report an Issue</h2>
          <p>Let us know about problems like potholes, overflowing trash, or broken lights.</p>
          <button onClick={() => window.location.href = "/user-issue"}>Report Now</button>
        </div>

        <div className="action-card">
          <h2>🗂️ My Issues</h2>
          <p>Track the progress of issues you’ve reported and receive updates.</p>
          <button onClick={() => window.location.href = "/my-issues"}>View Issues</button>
        </div>
      </div>

      <div className="encouragement-section">
        <h3>🚀 Spread the Word</h3>
        <p>Tell your friends and family about CityZen and encourage them to report issues too. Change starts with you!</p>
      </div>
    </div>
  );
};

export default UserHome;
