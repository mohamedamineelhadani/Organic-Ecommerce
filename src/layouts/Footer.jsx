import React from "react";
import { ArrowUpRight, Apple, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-scroll";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <Link className="footer-logo" to="home" smooth duration={600} spy offset={-75}>
            <Apple className="icon" /> Organic
          </Link>
          <h3 className="footer-title">Subscribe to our newsletter</h3>
          <div className="footer-subscribe">
            <input type="email" placeholder="Enter your email" className="footer-input" />
            <button className="subscribe-btn">
              Subscribe <ArrowUpRight className="icon" />
            </button>
          </div>
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