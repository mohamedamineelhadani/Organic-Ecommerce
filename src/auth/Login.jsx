import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = ({ display }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };



  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
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
      const result = await login(formData.email, formData.password);
      if (result.success) {
        setSuccessMessage("Login successful!");
        setTimeout(() => display("close"), 700);
      } else {
        setErrors({ password: result.message || "Login failed" });
      }
    } catch (error) {
      setErrors({ password: error.message || "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const switchToRegister = () => { display("register"); setErrors({}); setSuccessMessage(""); };
  const switchToForgot = () => { display("forgot"); setErrors({}); setSuccessMessage(""); };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Sign in to your account</p>

      <div className="form-group">
        <label htmlFor="login-email">Email Address</label>
        <div className="input-group">
          <Mail className="input-icon" size={20} />
          <input id="login-email" type="email" name="email" placeholder="your@email.com"
            value={formData.email} onChange={handleChange}
            className={errors.email ? "error" : ""} />
        </div>
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="form-group">
        <div className="label-row">
          <label htmlFor="login-password">Password</label>
          <button type="button" className="forgot-link" onClick={switchToForgot}>
            Forgot Password?
          </button>
        </div>
        <div className="input-group">
          <Lock className="input-icon" size={20} />
          <input id="login-password" type={showPassword ? "text" : "password"}
            name="password" placeholder="Enter your password"
            value={formData.password} onChange={handleChange}
            className={errors.password ? "error" : ""} />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>

      {successMessage && (
        <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>
          {successMessage}
        </div>
      )}

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
          <span className="checkmark"></span>
          Remember me
        </label>
      </div>

      <button type="submit" className="auth-submit-btn" disabled={isLoading}>
        {isLoading ? (<><div className="spinner"></div>Signing In...</>) : "Sign In"}
      </button>

      <p className="auth-switch">
        Don't have an account?{" "}
        <button type="button" onClick={switchToRegister}>Sign up</button>
      </p>
    </form>
  );
};

export default Login;