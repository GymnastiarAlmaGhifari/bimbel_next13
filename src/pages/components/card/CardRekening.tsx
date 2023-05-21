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
    <div className="flex flex-col bg-gradient-to-br from-Tertiary-50 to-Primary-50 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3 justify-between w-full h-max ">
      <div className="flex justify-between w-full">

      <div className="flex flex-col gap-1">
        <h3 className="text-sm text-Neutral-100">Nama Rekening</h3>
        <span className="font-bold text-sm  text-Neutral-100">
          {nama_rek}
        </span>
      </div>
      <div className="flex flex-col gap-1 items-end">
        <h3 className="text-sm text-Neutral-100">Nomor Rekening</h3>
        <span className="font-bold text-sm text-Neutral-100">
          {no_rek}
        </span>
      </div>
      </div>
      <div className="w-full h-[1px] bg-Neutral-100"></div>
      <div className="flex justify-end">
        <Button
          type="button"
          bgColor="bg-Neutral-100"
          brColor=""
          withBgColor
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
