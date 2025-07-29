import React, { useEffect, useState } from 'react';
import './Profile.css';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:4000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    navigate('/login');
  };

  const handleEdit = () => {
    navigate('/edit');
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        {user.image ? (
          <img src={user.image} alt="Profile" className="profile-image" />
        ) : (
          <FaUserCircle size={90} className="default-user-icon" />
        )}
        <h2>{user.name}</h2>
      </div>

      <div className="profile-details">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Helped:</strong> {user.helped}</p>
        <p><strong>Fake raised issues:</strong> {user.fake}</p>
        <p><strong>Created on:</strong> {new Date(user.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}</p>
        <p><strong>PIN Code:</strong> {user.pincode}</p>
        <p><strong>City:</strong> {user.region}</p>
      </div>

      <div className="profile-buttons">
        <button onClick={handleEdit} className="edit-btn">Edit</button>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};
