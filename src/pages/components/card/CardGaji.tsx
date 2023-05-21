import React, { FC } from "react";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";

type CardGajiProps = {
  role: string;
  gaji: string;
  onClick?: () => void;
};

const CardGaji: FC<CardGajiProps> = ({ role, gaji, onClick }) => {
  return (
    <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3 w-full">
      <div className="flex justify-between">
        <h1 className="text-xl text-Neutral-10 font-bold">{role}</h1>
        <div className="flex flex-col items-end gap-1 justify-end">
          <h3 className="text-sm text-Neutral-30">Gaji</h3>
          <span className="font-bold text-Primary-10">{gaji}</span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-Neutral-70"></div>
      <div className="flex justify-end">
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Gaji"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default CardGaji;
