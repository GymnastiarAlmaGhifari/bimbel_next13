"use client";

import { IconType } from "react-icons";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { IoLogoWhatsapp } from "react-icons/io";

interface ButtonProps {
  label: string;
  bgColor: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  outlined?: boolean;

  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  bgColor,
  disabled,
  isActive,
  outlined,
  icon: Icon,
}) => {
  const baseStyles =
    "px-4 py-2 rounded-full font-semibold flex gap-2 text-sm text-Tertiary-50 items-center ";
  const activeStyle = "text-Primary-10 bg-Primary-50";
  const inactiveStyle =
    "text-Primary-20 hover:bg-Neutral-100/[.2] hover:backdrop-opacity-10";

  const buttonStyle = `${
    isActive ? `${baseStyles} ${activeStyle}` : `${baseStyles} ${inactiveStyle}`
  }`;
  return (
    <button
      onClick={onClick}
      className={`${buttonStyle} ${bgColor}         ${
        outlined ? "bg-white" : "bg-rose-500"
      }
    ${outlined ? "border-black" : "border-rose-500"}
    ${outlined ? "text-black" : "text-white"}`}
    >
      {Icon && (
        <Icon
          size={24}
          className="
          "
        />
      )}
      <span>{label}</span>
    </button>
  );
};

export default Button;
