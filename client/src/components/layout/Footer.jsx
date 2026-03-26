import React from "react";
import "../../styles/Footer.css";
import { useScrollVisible } from "../../utils/useScrollVisible.js";

import {
  BiInfoCircle,
  BiLogoGithub,
  BiLogoLinkedinSquare,
  BiArrowToTop,
} from "react-icons/bi";

function Footer() {
  const isVisible = useScrollVisible(300);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="app-footer">
      <div className="footer-content">
        {isVisible && (
          <button
            className="back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Back to top button"
          >
            <BiArrowToTop size={35} />
          </button>
        )}

        <div className="footer-project-info">
          <span className="footer-badge">Portfolio Project</span>
          <p className="footer-note">
            <BiInfoCircle size={18} /> Data shown is simulated for demonstration
            purposes. Built as a technical showcase.
          </p>
        </div>

        <div className="footer-socials">
          <a
            href="https://github.com/Anuska86"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <BiLogoGithub size={35} />
          </a>
          <a
            href="https://www.linkedin.com/in/ana-sappia-rey/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <BiLogoLinkedinSquare size={35} />
          </a>
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
