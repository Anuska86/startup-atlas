import React from "react";
import {
  BiInfoCircle,
  BiLogoGithub,
  BiLogoLinkedinSquare,
  BiArrowToTop,
} from "react-icons/bi";
import "../styles/Footer.css";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <button
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Back to top button"
        >
          <BiArrowToTop />
          <span>Back to Top</span>
        </button>

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
            <BiLogoGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/ana-sappia-rey/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <BiLogoLinkedinSquare />
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
