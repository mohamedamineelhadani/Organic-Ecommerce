import React, { useState } from "react";
import { ArrowUpRight, Apple, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-scroll";
import { subscriptionService } from "../services/subscriptionService";
import { useToast } from "../context/ToastContext";

const Footer = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      toast.warning("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await subscriptionService.subscribe(trimmed);
      if (res.success) {
        toast.success(res.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(res.message || "Subscription failed");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <Link className="footer-logo" to="home" smooth duration={600} spy offset={-75}>
            <Apple className="icon" /> Organic
          </Link>
          <h3 className="footer-title">Subscribe to our newsletter</h3>

          <form className="footer-subscribe" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              className="footer-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              className="subscribe-btn"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Subscribe"}
              <ArrowUpRight className="icon" />
            </button>
          </form>
        </div>

        <div className="footer-content">
          <h3 className="footer-title">Our Address</h3>
          <ul className="footer-data">
            <li className="footer-information">1234 - Morocco</li>
            <li className="footer-information">Casablanca - 43210</li>
            <li className="footer-information">123-456-789</li>
          </ul>
        </div>

        <div className="footer-content">
          <h3 className="footer-title">Contact Us</h3>
          <ul className="footer-data">
            <li className="footer-information">+212 610781044</li>
            <div className="footer-social">
              <a href="https://www.facebook.com/" className="footer-social-link"><Facebook className="icon" /></a>
              <a href="https://www.instagram.com/" className="footer-social-link"><Instagram className="icon" /></a>
              <a href="https://twitter.com/" className="footer-social-link"><Twitter className="icon" /></a>
            </div>
          </ul>
        </div>
      </div>
      <p className="footer-copy">&#169; Organic. All rigths reserved</p>
    </footer>
  );
};

export default Footer;