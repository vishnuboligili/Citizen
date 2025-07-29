import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import imageIcon from '../../Assets/profile.jpg';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({});

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

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/admin/userlist", {
        method: "GET"
      });
      const responseData = await res.json();
      if (responseData.success) {
        setUsers(responseData.data);
      } else {
        console.log(responseData.message);
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const handleWorkerClick = (userId) => {
    setDropdownOpen((prev) => {
      const isOpen = prev[userId];
      const newState = {};
      if (!isOpen) newState[userId] = true;
      return newState;
    });
  };
  
  const handleRoleChange = async (userId, category) => {
    const data = {
      id: userId,
      role: 'worker',
      workerType: category
    };

    try {
      const res = await fetch("http://localhost:4000/admin/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const responseData = await res.json();
      if (!responseData.success) {
        console.log(responseData.message);
      }

      fetchUsers();
      setDropdownOpen((prev) => ({ ...prev, [userId]: false }));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="userlist-container">
      <h2>User List</h2>

      <input
        type="text"
        placeholder="Search by email"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        className="search-input"
      />

      <div>
        {filteredUsers.map(user => (
          <div key={user._id} className="user-card">
            <div className="user-info">
              <img
                src={user.profile || imageIcon}
                alt="profile"
                className="user-image"
              />
              <div>
                <div className="user-name">{user.name || 'Unnamed User'}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>

            <div className="worker-section">
              <button
                onClick={() => handleWorkerClick(user._id)}
                className="worker-button"
              >
                Worker
              </button>

              {dropdownOpen[user._id] && (
                <select
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  defaultValue=""
                  className="worker-select"
                >
                  <option value="" disabled>Select Category</option>
                  <option value="road">Road</option>
                  <option value="light">Light</option>
                  <option value="garbage">Garbage</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
