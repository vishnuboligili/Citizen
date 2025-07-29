import React from 'react';
import logo from '../../Assets/logo.jpeg';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { FaUserCircle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

export const NavBar = () => {
  const token = localStorage.getItem('auth-token');
  let userRole = null;
  let image = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.user.role;
      image = decoded.user.image;
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('auth-token');
    }
  }

  // 🔹 Function to get home route based on role
  const getHomeRoute = () => {
    if (userRole === 'admin') return '/adminHome';
    if (userRole === 'worker') return '/workerHome';
    if (userRole === 'user') return '/userHome';
    return '/'; // fallback for unauthenticated users
  };

  return (
    <div className="navbar">
      
      {/* 🔹 Logo always links to universal landing page */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="CityZen Logo" />
        </Link>
      </div>

      {/* 🔹 Navigation links based on user role */}
      <div className="navbar-icons">
        <Link to={getHomeRoute()}>HOME</Link>

        {userRole === 'user' && (
          <>
            <Link to="/user-issue">ISSUE</Link>
            <Link to="/my-issues">MY ISSUES</Link>
          </>
        )}

        {userRole === 'worker' && (
          <>
            <Link to="/worker-issue">ISSUE</Link>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <Link to="/admin-issue">ISSUE</Link>
            <Link to="/users-list">USERS LIST</Link>
            <Link to="/workers-list">WORKERS LIST</Link>
          </>
        )}
      </div>

      {/* 🔹 Profile icon or Login */}
      {token ? (
        <Link to="/profile" className="profile-icon" title="Profile">
          {image ? (
            <img src={image} alt="Profile" className="nav-profile-image" />
          ) : (
            <FaUserCircle size={40} />
          )}
        </Link>
      ) : (
        <div className="nav-login">
          <Link to="/login">LogIn</Link>
        </div>
      )}
    </div>
  );
};
