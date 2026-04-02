import "../../styles/Button.css";

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  icon: Icon,
  ...props
}) => {
  return (
    <button
      className={`custom-btn ${variant} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="btn-icon" />}
      {children}
    </button>
  );
};

export default Button;
