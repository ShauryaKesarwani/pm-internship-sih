import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", onClick }) => {
  const baseClasses = "px-6 py-3 rounded-md font-semibold";
  const variantClasses =
    variant === "primary"
      ? "bg-orange-500 text-white hover:bg-orange-600"
      : "border border-gray-400 text-gray-700 hover:bg-gray-100";

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
