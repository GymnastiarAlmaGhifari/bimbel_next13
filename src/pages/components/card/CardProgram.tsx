import React, { FC } from "react";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";

type CardProgramProps = {
  nama_program: string;
  level: string;
  deskripsi?: string;
  tipe: string;
  kelas: string;
  onEdit: () => void;
};

const CardProgram: FC<CardProgramProps> = ({
  nama_program,
  kelas,
  level,
  deskripsi,
  tipe,
  onEdit,
}) => {
  return (
    <div className="flex flex-col bg-Neutral-100 border rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <h1 className="text-xl text-Neutral-10 font-bold">{nama_program}</h1>
        <div className="flex flex-col gap-1 justify-end">
          <span className="font-bold text-sm text-Primary-10">{level}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Tipe</h3>
          <span className="font-bold text-sm text-Primary-10">{tipe}</span>
        </div>
        <div className="flex flex-col gap-1 justify-end">
          <h3 className="text-sm text-Neutral-30">Kelas</h3>
          <span className="font-bold text-sm text-Primary-10">{kelas}</span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <div className="flex justify-end">
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Program"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          onClick={onEdit}
        />
      </div>
    </div>
  );
};

export default CardProgram;
