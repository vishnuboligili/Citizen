import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import './MyIssue.css';

const MyIssue = () => {
  const [issues, setIssues] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      const token = localStorage.getItem("auth-token");

      if (!token) {
        window.location.href = "/login";
      return;

      }
      console.log(1);
      try {
        const res = await fetch("http://localhost:4000/user/myissues", {
          method: "GET",
          headers: {
            'auth-token': token,
          }
        });
        
        const data = await res.json();
        if (data.success) {
          setIssues(data.issues);
          console.log(issues);
        } else {
          setMessage(data.message || "⚠️ Failed to fetch issues.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage("⚠️ Could not load issues.");
      }
    };

    fetchIssues();
  }, []);

  const statusColors = {
    pending: "#f39c12",
    "in progress": "#3498db",
    resolved: "#2ecc71"
  };

  const renderIssuesByStatus = (status) => {
    const filtered = issues.filter(issue => issue.status === status);
    if (filtered.length === 0) return null;

    return (
      <div className="issue-section">
        <h3 style={{ color: statusColors[status] }}>{status.toUpperCase()}</h3>
        <div className="issue-grid">
          {filtered.map(issue => (
            <div key={issue._id} className="issue-card">
              <img src={issue.image} alt="issue" className="issue-image" />
              <p><strong>Category:</strong> {issue.category}</p>
              <p><strong>Location:</strong> {issue.location} ({issue.pincode})</p>
              <p><strong>Description:</strong> {issue.description}</p>
              <p><strong>Status:</strong> <span style={{ color: statusColors[status] }}>{status}</span></p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="my-issue-container">
      <h2>📝 My Reported Issues</h2>
      {message && <p className="error-message">{message}</p>}
      {renderIssuesByStatus("pending")}
      {renderIssuesByStatus("in progress")}
      {renderIssuesByStatus("resolved")}
    </div>
  );
};

export default MyIssue;
