import "../styles/Logo.css";

export const StartupAtlasLogo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="logo-svg"
  >
    {/* The Main Globe  */}
    <circle
      cx="12"
      cy="12"
      r="8"
      stroke="var(--electric-sapphire)"
      strokeWidth="2"
    />

    {/* Grid Lines (The 'Atlas' detail) - */}
    <path
      d="M12 4V20"
      stroke="var(--electric-sapphire)"
      strokeWidth="1"
      opacity="0.5"
    />
    <path
      d="M4 12H20"
      stroke="var(--electric-sapphire)"
      strokeWidth="1"
      opacity="0.5"
    />

    {/* The 'X' / Orbital Paths  */}
    <ellipse
      cx="12"
      cy="12"
      rx="11"
      ry="3"
      stroke="var(--sky-aqua)"
      strokeWidth="1.5"
      transform="rotate(-15 12 12)"
    />
  </svg>
);
