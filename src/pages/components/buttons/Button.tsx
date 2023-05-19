"use client";

import { IconType } from "react-icons";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { IoLogoWhatsapp } from "react-icons/io";
import { ButtonHTMLAttributes, HtmlHTMLAttributes } from "react";

interface ButtonProps {
  type: any;
  label: string;
  bgColor: string;
  textColor: string;
  brColor: string;
  onClick?: () => void;
  isActive?: boolean;
  rightIcon?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  withBgColor?: boolean;
  center?: boolean;
  icon?: IconType;
  noLabel?: boolean;
  widthAuto?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  isActive,
  outlined,
  textColor,
  brColor,
  bgColor,
  type,
  noLabel,
  widthAuto,
  withBgColor,
  center,
  rightIcon,
  // widthButton,
  icon: Icon,
}) => {
  const baseButtonStyle =
    "px-4 py-2 rounded-full font-bold flex gap-2 text-sm items-center h-10 ";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseButtonStyle} ${
        outlined
          ? `${bgColor} bg-opacity-0 border-[2px] ${brColor} ${textColor} font-bold text-sm`
          : `${bgColor} bg-opacity-0  border-none ${textColor}`
      } ${
        withBgColor
          ? "bg-opacity-90 hover:bg-opacity-100"
          : "hover:bg-opacity-20"
      } ${widthAuto ? "w-full" : "w-max"} ${center ? "justify-center" : ""}
      `}
    >
      {Icon && (
        <Icon
          size={24}
          className="
          "
        />
      )}
      {noLabel ? "" : <span>{label}</span>}
    </button>
  );
};

export default Button;
