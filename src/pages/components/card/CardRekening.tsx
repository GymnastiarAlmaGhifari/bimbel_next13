import React, { FC } from "react";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";

type CardRekeningProps = {
  nama_rek: string;
  no_rek: string;
  onClick?: () => void;
};

const CardRekening: FC<CardRekeningProps> = ({ nama_rek, no_rek, onClick }) => {
  return (
    <div className="flex flex-col bg-Neutral-100 border rounded-lg py-5 px-4 gap-3 justify-between w-full h-max">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm text-Neutral-30">Rekening</h3>
        <span className="font-bold text-sm text-Primary-10">
          {nama_rek} {no_rek}
        </span>
      </div>
      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <div className="flex justify-end">
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Rekening"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default CardRekening;
