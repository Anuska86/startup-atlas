import React from "react";
import "../../styles/Footer.css";
import Button from "../common/Button.jsx";

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
          <Button
            className="back-to-top-btn"
            variant="secondary"
            onClick={scrollToTop}
            icon={BiArrowToTop}
            aria-label="Back to top"
          />
        )}

        <div className="footer-project-info">
          <span className="footer-badge">Portfolio Project</span>
          <p className="footer-note">
            <BiInfoCircle size={18} /> Data sourced from Kaggle & Y Combinator.
            Built as a technical showcase.
          </p>
        </div>

        <div className="footer-socials">
          <a
            href="https://github.com/Anuska86"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant="secondary"
              icon={BiLogoGithub}
              arial-label="GitHub"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/ana-sappia-rey/"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant="secondary"
              icon={BiLogoLinkedinSquare}
              aria-label="LinkedIn"
            />
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
