import React from "react";
import { BiInfoCircle } from "react-icons/bi";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-project-info">
          <span className="footer-badge">Portfolio Project</span>
          <p className="footer-note">
            <BiInfoCircle size={18} /> Data shown is simulated for demonstration
            purposes. Built as a technical showcase.
          </p>
        </div>
        <div className="footer-credits">
          <p>
            &copy; {new Date().getFullYear()} <strong>Startup Atlas</strong> |
            Developed by Ana Sappia Rey
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
