import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Forgot from "./Forgot";
import { Apple, X } from "lucide-react";
import "./style.css";

const AuthSystem = ({ display, closeLogin }) => {
  const [authMode, setAuthMode] = useState("login");

  const handleModeChange = (mode) => {
    if (mode === "close") {
      closeLogin();
      setTimeout(() => setAuthMode("login"), 300);
    } else {
      setAuthMode(mode);
    }
  };

  return (
    <div className={`auth-container ${display ? "active" : ""}`}>
      <div className="auth-side">
        <div className="side-logo">
          <Apple className="logo-icon" /> Organic
        </div>
      </div>

      <div className="auth-forms">
        <button className="close-auth" onClick={closeLogin}>
          <X />
        </button>
        {authMode === "login" && <Login display={handleModeChange} />}
        {authMode === "register" && <Register display={handleModeChange} />}
        {authMode === "forgot" && <Forgot display={handleModeChange} />}
      </div>
    </div>
  );
};

export default AuthSystem;