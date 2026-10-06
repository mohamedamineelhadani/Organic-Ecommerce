import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-scroll";
import { Sun, Moon, Apple, User, LogOut, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = ({ openLogin }) => {
  const [theme, setTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menu = useRef(null);
  const menuBtn = useRef(null);
  const userMenuRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();

  const menuItems = [
    { to: "home", label: "Home" },
    { to: "about", label: "About" },
    { to: "products", label: "Products" },
    { to: "questions", label: "FAQs" },
    { to: "contact", label: "Contact Us" },
  ];

  const handleScroll = () => setScrolled(window.scrollY > 20);

  const displayMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    menu.current?.classList.toggle("active");
    menuBtn.current?.classList.toggle("active");
  };

  const handleClickOutside = (event) => {
    if (
      menu.current && !menu.current.contains(event.target) &&
      menuBtn.current && !menuBtn.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
      menu.current.classList.remove("active");
      menuBtn.current?.classList.remove("active");
    }
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setUserMenuOpen(false);
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsMenuOpen(false);
      menu.current?.classList.remove("active");
      menuBtn.current?.classList.remove("active");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const themeSwitch = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setTheme("dark");
      document.body.classList.add("dark-theme");
    }
  }, []);

  const handleUserClick = () => {
    if (!isAuthenticated) {
      openLogin();
    } else {
      setUserMenuOpen(!userMenuOpen);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrdersClick = () => {
    setUserMenuOpen(false);
    const el = document.getElementById('orders');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`} id="header">
      <nav className="nav">
        <Link className="nav-logo" to="home" smooth duration={600} spy offset={-75} onClick={handleLinkClick}>
          <Apple className="logo-icon" /> Organic
        </Link>

        <div className={`nav-menu ${isMenuOpen ? "show-menu" : ""}`} id="nav-menu">
          <ul className="links-list" ref={menu}>
            {menuItems.map((item, index) => (
              <li className="link-item" key={index}>
                <Link className="link" to={item.to} smooth duration={600} spy offset={-75}
                  activeClass="active-link" onClick={handleLinkClick}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-btns">
          <button className="theme-btn" onClick={themeSwitch}>
            {theme === "light" ? <Sun className="icon" /> : <Moon className="icon" />}
          </button>

          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <button
              className={`user-btn ${isAuthenticated ? 'active' : 'not'}`}
              onClick={handleUserClick}
            >
              <User className="user-btn-icon" />
              <span className="online-badge"></span>
            </button>

            {isAuthenticated && userMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                background: 'var(--container-color)',
                borderRadius: 12,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                minWidth: 210,
                padding: '0.5rem',
                zIndex: 200,
              }}>
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #eee', marginBottom: '0.25rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-color-light)', margin: 0 }}>Signed in as</p>
                  <p style={{ fontWeight: 600, margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>{user?.full_name}</p>
                </div>
                <button
                  onClick={handleOrdersClick}
                  style={{
                    width: '100%', textAlign: 'left', padding: '0.65rem 0.75rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'none', border: 'none', borderRadius: 8,
                    cursor: 'pointer', color: 'var(--text-color)', fontSize: '0.9rem'
                  }}
                >
                  <Package size={18} /> My Orders
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', textAlign: 'left', padding: '0.65rem 0.75rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'none', border: 'none', borderRadius: 8,
                    cursor: 'pointer', color: '#ef4444', fontSize: '0.9rem'
                  }}
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>

          <button
            className={`toggle-btn ${isMenuOpen ? "active" : ""}`}
            onClick={displayMenu}
            ref={menuBtn}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;