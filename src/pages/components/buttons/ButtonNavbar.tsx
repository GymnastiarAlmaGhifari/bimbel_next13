"use client";

import { Link } from "react-scroll";

interface buttonNavbarProps {
  label: string;
  // onClick: () => void;
  isActive?: boolean;
  goTo: string;
}

const ButtonNavbar: React.FC<buttonNavbarProps> = ({
  label,
  // onClick,
  goTo,
  isActive,
}) => {
  const baseStyle =
    "text-Primary-10 cursor-pointer px-4 py-2 rounded-full text-sm font-semibold flex items-center ";
  const activeStyle =
    "text-Primary-20 bg-Primary-50 hover:bg-Primary-50 hover:backdrop-opacity-100 text-Neutral-100";
  const inactiveStyle =
    " hover:bg-Neutral-100/[.2] hover:backdrop-opacity-10 transition-all duration-100";
  const buttonStyle = `${baseStyle} ${inactiveStyle}`;

  return (
    <Link
      to={goTo}
      duration={250}
      spy
      smooth
      offset={-60}
      activeClass={activeStyle}
      className={buttonStyle}
    >
      {label}
    </Link>
  );
};

export default ButtonNavbar;
