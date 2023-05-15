import React, { FC } from "react";
import { MdModeEdit } from "react-icons/md";

type ButtonEditProps = {
  label: string;
  onClick: () => void;
};

const ButtonEdit: FC<ButtonEditProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 text-sm text-Tertiary-50 items-center"
    >
      <MdModeEdit size={18} />
      <span>{label}</span>
    </button>
  );
};

export default ButtonEdit;
