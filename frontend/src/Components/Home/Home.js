// Home.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      offset: 200,
    });
  }, []);

  return (
    <div className="home-container">
      {/* Fullscreen Hero Image */}
      <section className="hero-fullpage">
        <div className="hero-img-wrapper">
          <img src="/images/mainimage.png" alt="CityZen Hero Banner" />
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero" >
        <h1>Empower Your City</h1>
        <p>
          Report local issues like potholes, broken lights, or garbage in just a few clicks.
          Join thousands of active citizens improving their neighborhood!
        </p>
        <Link to="/Register" className="register-button">Register Now</Link>
      </section>

      {/* About CityZen */}
      <section className="about-cityzen">
        <div className="about-image">
          <img src="/images/about-citezen.jpg" alt="About CityZen" />
        </div>
        <div className="about-text"  data-aos="fade-right">
          <h2>About CityZen</h2>
          <p>
            CityZen is your gateway to a smarter, cleaner, and more connected city. With just a few taps,
            citizens can report issues like potholes, broken lights, and garbage dumps. We bridge the gap
            between local governments and the public—fostering accountability, speed, and transparency.
          </p>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="key-features" >
        <div className="features-text" data-aos="zoom-in">
          <h2>Key Features</h2>
          <p>
            CityZen is built with essential features that empower both citizens and authorities.
            From real-time issue tracking to automated assignment, our platform ensures a seamless,
            transparent, and efficient reporting experience.
          </p>
          <ul>
            <li>🕒 Real-time status tracking for every report</li>
            <li>⚙️ Automatic issue assignment to respective departments</li>
            <li>📊 Dashboard insights for government workers</li>
            <li>🔔 Instant notifications for updates and actions</li>
          </ul>
        </div>
        <div className="features-image">
          <img src="/images/roadissues.jpg" alt="CityZen Features" />
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" >
        <h2>How It Works</h2>
        <p className="hiw-subtitle">Reporting local issues is now easier than ever.</p>
        <div className="hiw-content">
          <div className="hiw-image-container">
            <img src="/images/howitworks.jpg" alt="How it works" className="hiw-main-image" />
          </div>
          <div className="hiw-steps-container">
            <div className="hiw-card" data-aos="fade-up" data-aos-delay="100">
              <div className="hiw-icon">1</div>
              <div>
                <h3>Create an Account</h3>
                <p>Sign up to get started and be part of your city's progress.</p>
              </div>
            </div>
            <div className="hiw-card" data-aos="fade-up" data-aos-delay="200">
              <div className="hiw-icon">2</div>
              <div>
                <h3>Report an Issue</h3>
                <p>Describe the problem, set location, and submit a photo if needed.</p>
              </div>
            </div>
            <div className="hiw-card" data-aos="fade-up" data-aos-delay="300">
              <div className="hiw-icon">3</div>
              <div>
                <h3>Get Notified</h3>
                <p>Receive updates when your issue is reviewed and resolved.</p>
              </div>
            </div>
            <div className="hiw-card" data-aos="fade-up" data-aos-delay="400">
              <div className="hiw-icon">4</div>
              <div>
                <h3>Make an Impact</h3>
                <p>Track all your submissions and see your neighborhood improve.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Impact */}
      <section className="project-impact" >
        <div className="impact-text" data-aos="fade-left">
          <h2>Why CityZen Matters</h2>
          <p>
            CityZen bridges the gap between citizens and governing bodies by providing a digital channel
            for transparent communication and action. It’s more than an app — it’s a movement towards
            responsible urban governance.
          </p>
          <ul>
            <li>🌐 Empowers citizens to raise civic issues with ease</li>
            <li>✅ Promotes accountability in urban administration</li>
            <li>💡 Encourages proactive problem-solving at the grassroots</li>
            <li>📍 Location-based reporting for faster response</li>
          </ul>
        </div>
        <div className="impact-image">
          <img src="/images/fullimpact.jpg" alt="Community Impact through CityZen" />
        </div>
      </section>
    </div>
  );
};

export default Home;
