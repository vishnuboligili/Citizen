import React, { useEffect, useState } from "react";
import "./SplashScreen.css";

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onFinish(), 1000); // match CSS animation
    }, 1000); // splash visible for 2.5s

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`splash-container ${fadeOut ? "fade-slide-out" : ""}`}>
      <img src="/splash.jpg" alt="Splash" className="splash-image" />
    </div>
  );
};

export default SplashScreen;
