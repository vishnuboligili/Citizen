import React, { useState } from 'react';
import './Register.css';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { MdClose } from 'react-icons/md';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    pincode: '',
    city: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [region, setRegion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const { username, email, password, pincode, city } = formData;
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const pinRegex = /^[1-9][0-9]{5}$/;

    if (!username.trim()) newErrors.username = 'Username is required';

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format';
    else if (!email.toLowerCase().endsWith('@gmail.com')) newErrors.email = 'Only @gmail.com addresses are allowed';

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!pinRegex.test(pincode)) newErrors.pincode = 'Pincode must be exactly 6 digits';
    else if (!city) newErrors.pincode = 'Invalid or unsupported pincode';

    return newErrors;
  };

  const fetchRegion = async (pin) => {
    if (pin.length === 6 && /^[1-9][0-9]{5}$/.test(pin)) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();

        if (data[0].Status === 'Success') {
          const cityName = data[0].PostOffice[0].Name;
          setRegion(cityName);
          setFormData((prev) => ({ ...prev, city: cityName }));
          setErrors((prev) => ({ ...prev, pincode: null }));
        } else {
          setRegion('');
          setFormData((prev) => ({ ...prev, city: '' }));
          setErrors((prev) => ({ ...prev, pincode: 'Invalid pincode' }));
        }
      } catch (error) {
        setRegion('');
        setFormData((prev) => ({ ...prev, city: '' }));
        setErrors((prev) => ({ ...prev, pincode: 'Failed to fetch region' }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'pincode' && value.length <= 6) {
      fetchRegion(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Additional hard check before full validation
    if (formData.pincode.length !== 6) {
      setErrors((prev) => ({
        ...prev,
        pincode: 'Pincode must be exactly 6 digits',
      }));
      return; // Block submission
    }

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      try {
        const res = await fetch('http://localhost:4000/register', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const responseData = await res.json();

        if (responseData.success) {
          toast.success("Registered successfully! Redirecting to OTP...", {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
          setTimeout(() => {
            window.location.replace('/otp');
          }, 3000);
        } else {
          toast.error(responseData.message || "Registration failed", {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
        }
      } catch (error) {
        console.log('Registration error:', error);
        toast.error("Server error. Please try again later.", {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      }
    } else {
      setSubmitted(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <h2>Register</h2>

        <div className="input-wrapper">
          <FaUser className="icon" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        {errors.username && <p className="error">{errors.username}</p>}

        <div className="input-wrapper">
          <FaEnvelope className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && <p className="error">{errors.email}</p>}

        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span
            className="icon password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        <div className="input-wrapper">
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            maxLength={6}
          />
        </div>
        {errors.pincode && <p className="error">{errors.pincode}</p>}
        {region && <p className="region-text">📍 City: {region}</p>}

        <button type="submit">Register</button>

        <p className="login-text">
          Already have an account? <Link to='/login'>Log in</Link>
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
