import React, { FC } from "react";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";

type CardMapelProps = {
  nama_kelas: string;
  nama_mapel: string;
  onClick?: () => void;
};

const CardMapel: FC<CardMapelProps> = ({ nama_kelas, nama_mapel, onClick }) => {
  return (
    <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 justify-en">
          <h3 className="text-sm text-Neutral-30">Mata Pelajaran</h3>
          <span className="font-bold text-Primary-10">
            {nama_mapel}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 justify-end">
          <h3 className="text-sm text-Neutral-30">Kelas</h3>
          <span className="font-bold text-Primary-10">
            {nama_kelas}
          </span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-Neutral-70"></div>
      <div className="flex justify-end">
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Mata Pelajaran"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default CardMapel;
