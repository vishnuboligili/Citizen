import React from 'react';
import './Footer.css';

export const Footer = () => {
  const token = localStorage.getItem('auth-token'); // Adjust 'token' name if needed

  if (token) return null; // ⛔ Don't show footer if user is logged in

  const teamMembers = [
    {
      name: 'Sivaji Sandhu',
      role: 'Frontend Developer',
      contribution: 'Designed user interface and implemented login, registration, and user issue pages.',
      img: '/images/shivv.jpg',
      linkedin: 'https://www.linkedin.com/in/sivaji-sandu-2a5402305',
      github: 'https://github.com/sivaji-sandhu'
    },
    {
      name: 'Vishnu Vardhan Boligili',
      role: 'Backend Developer',
      contribution: 'Built the authentication system and API integration for issue reporting.',
      img: '/images/vishnu.jpg',
      linkedin: 'https://www.linkedin.com/in/vishnu-boligili-0385ba280',
      github: 'https://github.com/vishnuboligili'
    },
    {
      name: 'Kishore Boligili',
      role: 'Backend Developer',
      contribution: 'Built the authentication system and API integration for issue reporting.',
      img: '/images/kishore.jpg',
      linkedin: 'https://www.linkedin.com/in/kishore-boligili-a65a03280?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      github: 'https://github.com/Kishore147801'
    },
    {
      name: 'Subha Jeevan Rayapu',
      role: 'Frontend Developer',
      contribution: 'Designed user interface and implemented login, registration, and user issue pages.',
      img: '/images/subbu.jpg',
      linkedin: 'https://www.linkedin.com/in/rayapu-subha-jeevan-b9aa392b5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      github: 'https://github.com/Subhajeevan'
    }
  ];

  return (
    <footer className="footer">
      {/* <div className="team-section">
        <h3>Meet the Team</h3>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.img} alt={member.name} className="team-photo" />
              <h4>{member.name}</h4>
              <p className="role">{member.role}</p>
              <p className="contribution">{member.contribution}</p>
              <div className="social-links">
                <a href={member.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={member.github} target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      <div className="footer-bottom">
        <p>© 2025 | Developed by Team CityZen</p>
      </div>
    </footer>
  );
};
