import React, { useState } from 'react';
import './Login.css';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { MdClose } from 'react-icons/md';
import { jwtDecode } from 'jwt-decode';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    } else if (!email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'Only @gmail.com addresses are allowed';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      const formBody = { email, password };

      try {
        const response = await fetch('http://localhost:4000/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formBody),
        });

        const responseData = await response.json();
        console.log("Login response:", responseData);

        if (responseData.success) {
          const { token, role } = responseData;

          // Save token and role
          localStorage.setItem('auth-token', token);
          localStorage.setItem('role', role);

          toast.success('Login successful', {
            position: 'top-right',
            autoClose: 2000,
            theme: 'colored',
          });

          // Redirect after a short delay
          setTimeout(() => {
            switch (role?.toLowerCase()) {
              case 'admin':
                window.location.replace('/adminHome');
                break;
              case 'worker':
                window.location.replace('/workerHome');
                break;
              case 'user':
                window.location.replace('/userHome');
                break;
              default:
                window.location.replace('/');
                break;
            }
          }, 2000);
        } else {
          toast.error(responseData.message || 'Login failed', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
          setSubmitted(false);
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Something went wrong', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
        setSubmitted(false);
      }
    } else {
      setSubmitted(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>Login</h2>

        <div className="input-wrapper">
          <FaUser className="icon" />
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {errors.email && <p className="error">{errors.email}</p>}

        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="icon password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit" disabled={submitted}>
          {submitted ? 'Logging in...' : 'Login'}
        </button>

        <p className="signup-text">
          Don't have an account? <Link to="/register">Click here</Link>
        </p>
        <p className="signup-text">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
        closeButton={({ closeToast }) => (
          <MdClose
            onClick={closeToast}
            style={{
              color: 'white',
              fontSize: '20px',
              position: 'absolute',
              top: '10px',
              right: '10px',
              cursor: 'pointer',
            }}
          />
        )}
      />
    </div>
  );
};
