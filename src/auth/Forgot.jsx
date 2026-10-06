import React, { useState } from "react";
import { Mail, AlertCircle, ArrowLeft } from "lucide-react";

const Forgot = ({ display }) => {
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simple demo — replace with real endpoint later
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("If that email exists, a reset link was sent.");
      setTimeout(() => setSuccessMessage(""), 4000);
    }, 1200);
  };

  const switchToLogin = () => display("login");

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <button type="button" className="back-btn" onClick={switchToLogin}>
        <ArrowLeft size={20} /> Back to Sign In
      </button>

      <h2 className="auth-title">Reset Password</h2>
      <p className="auth-subtitle">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <div className="form-group">
        <label htmlFor="forgot-email">Email Address</label>
        <div className="input-group">
          <Mail className="input-icon" size={20} />
          <input id="forgot-email" type="email" name="email" placeholder="your@email.com"
            value={formData.email} onChange={handleChange}
            className={errors.email ? "error" : ""} />
        </div>
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      {successMessage && (
        <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>
          {successMessage}
        </div>
      )}

      <button type="submit" className="auth-submit-btn" disabled={isLoading}>
        {isLoading ? (<><div className="spinner"></div>Sending Reset Link...</>) : "Send Reset Link"}
      </button>

      <div className="auth-notes">
        <AlertCircle size={18} />
        <p>If you don't receive an email within a few minutes, please check your spam folder.</p>
      </div>
    </form>
  );
};

export default Forgot;