import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import './UserIssue.css';
import defaultUploadIcon from '../../Assets/upload_area.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { MdClose } from 'react-icons/md';


export const UserIssue = () => {
  const [issueType, setIssueType] = useState("road");
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [postOffices, setPostOffices] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [message, setMessage] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const user = decoded.user;

      if (user?.pincode) {
        setPincode(String(user.pincode));
        fetchLocationFromPincode(String(user.pincode));
      }

      if (user?.city) {
        setCity(user.city);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
    }
  }, []);

  const fetchLocationFromPincode = async (pin) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await response.json();

      if (data[0].Status === "Success") {
        const offices = data[0].PostOffice;
        const dist = offices[0].District;

        setPostOffices(offices);
        setSelectedRegion(offices[0].Name);
        setDistrict(dist);

        setMessage("");  // ✅ No validation against city name
      } else {
        setPostOffices([]);
        setMessage("⚠️ Invalid pincode.");
      }
    } catch (err) {
      console.error("Pincode API error:", err);
      setPostOffices([]);
      setMessage("⚠️ Failed to fetch location.");
    }
  };

  const handleSubmit = async (e) => {
    console.log(1);
    e.preventDefault();
  
    if (!issueType || !description || !photo || !selectedRegion) {
      setMessage("❌ All fields are required.");
      return;
    }
  
    if (description.length === 0 || description.length > 200) {
      setDescriptionError("❌ Description must be between 1 and 200 characters.");
      return;
    } else {
      setDescriptionError("");
    }
    
    // 🔐 Get user._id from token
    const token = localStorage.getItem("auth-token");
    let userId = "";
    if (!token) {
      window.location.href = "/login";
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      userId = decoded.user?.id || decoded.user?._id;
  
      if (!userId) throw new Error("User ID not found in token");
    } catch (err) {
      console.error("Token error:", err);
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
      return;
    }
  
    // 📤 Upload image
    const imageData = new FormData();
    let imageUrl;
  
    imageData.append('image', photo);
  
    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: imageData
      });
      const data = await response.json();
  
      if (data.success) {
        imageUrl = data.image_url;
      } else {
        setMessage("⚠️ Failed to upload image.");
        return;
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setMessage("⚠️ Image upload failed.");
      return;
    }
  
    // 📝 Prepare JSON body for issue submission
    const payload = {
      description,
      category: issueType,
      location: selectedRegion,
      image: imageUrl,
      createdBy: userId,
      pincode
    };
  
    try {
      const res = await fetch("http://localhost:4000/user/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify(payload)
      });
  
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "❌ Failed to submit issue.", {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'colored',
                  });
              } else {
        toast.success(result.message || "✅ Issue submitted successfully.", {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'colored',
                  });
        setDescription("");
        setPhoto(null);
      }
    } catch (err) {
      console.error("Backend error:", err);
      toast.error("⚠️ Error sending data to backend.", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }
  };
  
  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  return (
    <div className="user-issue-container">
      <h2>📢 Report an Issue ({city})</h2>
      <form onSubmit={handleSubmit} className="issue-form">
        <div className="issue-buttons-group">
          {["road", "light", "garbage"].map((type) => (
            <button
              type="button"
              key={type}
              className={`issue-button ${issueType === type ? "selected" : ""}`}
              onClick={() => setIssueType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <label>
          Upload Photo:
          <label htmlFor="file-input" style={{ cursor: "pointer" }}>
            <img
              src={photo ? URL.createObjectURL(photo) : defaultUploadIcon}
              alt="Upload"
              className="thumbnail-img"
            />
          </label>
          <input
            type="file"
            accept="image/*"
            id="file-input"
            hidden
            onChange={imageHandler}
          />
          {photo && <p className="photo-info">📷 {photo.name} selected</p>}
        </label>

        <label>
          Select Region (under {pincode}):
          <select
            className="form-input"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {postOffices.map((office) => (
              <option key={office.Name} value={office.Name}>
                {office.Name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Describe the issue:
          <textarea
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide details about the issue..."
            rows={4}
            required
          />
          {descriptionError && <p className="error-text">{descriptionError}</p>}
        </label>

        <button type="submit" className="submit-button">
          ✅ Submit Issue
        </button>
      </form>

      {message && <p className="message-text">{message}</p>}
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
