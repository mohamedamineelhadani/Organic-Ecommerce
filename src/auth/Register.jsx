import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = ({ display }) => {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "", username: "", phone: ""
  });
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
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.username.trim()) newErrors.username = "Full name is required";
    else if (formData.username.length < 3) newErrors.username = "Full name must be at least 3 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const result = await register({
        full_name: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '',
      });

      if (result.success) {
        setSuccessMessage("Account created successfully!");
        setTimeout(() => display("close"), 900);
      } else {
        setErrors({ email: result.message || "Registration failed" });
      }
    } catch (error) {
      setErrors({ email: error.message || "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => { display("login"); setErrors({}); setSuccessMessage(""); };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-title">Create Account</h2>
      <p className="auth-subtitle">Join our community</p>

      <div className="form-group">
        <label htmlFor="register-username">Full Name</label>
        <div className="input-group">
          <User className="input-icon" size={20} />
          <input id="register-username" type="text" name="username"
            placeholder="Enter your full name" value={formData.username}
            onChange={handleChange} className={errors.username ? "error" : ""} />
        </div>
        {errors.username && <div className="error-message">{errors.username}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="register-phone">Phone (Optional)</label>
        <div className="input-group">
          <Phone className="input-icon" size={20} />
          <input id="register-phone" type="tel" name="phone" placeholder="+212 6XX XXX XXX"
            value={formData.phone} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="register-email">Email Address</label>
        <div className="input-group">
          <Mail className="input-icon" size={20} />
          <input id="register-email" type="email" name="email" placeholder="your@email.com"
            value={formData.email} onChange={handleChange}
            className={errors.email ? "error" : ""} />
        </div>
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="register-password">Password</label>
        <div className="input-group">
          <Lock className="input-icon" size={20} />
          <input id="register-password" type={showPassword ? "text" : "password"}
            name="password" placeholder="Create a password"
            value={formData.password} onChange={handleChange}
            className={errors.password ? "error" : ""} />
          <button type="button" className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="register-confirm">Confirm Password</label>
        <div className="input-group">
          <Lock className="input-icon" size={20} />
          <input id="register-confirm" type={showPassword ? "text" : "password"}
            name="confirmPassword" placeholder="Confirm your password"
            value={formData.confirmPassword} onChange={handleChange}
            className={errors.confirmPassword ? "error" : ""} />
        </div>
        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
      </div>

      {successMessage && (
        <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>
          {successMessage}
        </div>
      )}

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" name="terms" required />
          <span className="checkmark"></span>
          I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link>{" "}
          and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
        </label>
      </div>

      <button type="submit" className="auth-submit-btn" disabled={isLoading}>
        {isLoading ? (<><div className="spinner"></div>Creating Account...</>) : "Create Account"}
      </button>

      <p className="auth-switch">
        Already have an account?{" "}
        <button type="button" onClick={switchToLogin}>Sign in</button>
      </p>
    </form>
  );
};

export default Register;