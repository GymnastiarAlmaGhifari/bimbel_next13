import React, { FC } from "react";
import Button from "../buttons/Button";
import { MdModeEdit, MdDelete } from "react-icons/md";

type CardKelasProps = {
  nama_kelas: string;

  onEdit?: () => void;
  onDelete?: () => void;
};

const CardKelas: FC<CardKelasProps> = ({ nama_kelas, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 justify-end">
          <h3 className="text-sm text-Neutral-30">Kelas</h3>
          <span className="font-bold text-Primary-10">
            {nama_kelas}
          </span>
        </div>

        <div className="flex flex-row gap-3">
          <Button
            bgColor="bg-Error-50"
            brColor=""
            label="Hapus Kelas"
            textColor="text-Error-40"
            type="button"
            icon={MdDelete}
            onClick={onDelete}
          />
          <Button
            type="button"
            bgColor="bg-Tertiary-50"
            brColor=""
            label="Edit Kelas"
            textColor="text-Tertiary-50"
            icon={MdModeEdit}
            onClick={onEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default CardKelas;
