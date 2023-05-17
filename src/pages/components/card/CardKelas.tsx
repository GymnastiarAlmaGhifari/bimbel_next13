import React, { FC } from "react";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";

type CardKelasProps = {
  nama_kelas: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const CardKelas: FC<CardKelasProps> = ({ nama_kelas, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col bg-Neutral-100 border rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 justify-end">
          <h3 className="text-sm text-Neutral-30">Kelas</h3>
          <span className="font-bold text-sm text-Primary-10">
            {nama_kelas}
          </span>
        </div>
        <div className="flex flex-row gap-3">
          <Button
            type="button"
            bgColor="bg-Tertiary-50"
            brColor=""
            label="Edit Kelas"
            textColor="text-Tertiary-50"
            icon={MdModeEdit}
            onClick={onEdit}
          />
          <Button
            bgColor="bg-Error-50"
            brColor=""
            label="Hapus Kelas"
            textColor="text-Neutral-100"
            type="button"
            withBgColor
            onClick={onDelete}
          />
        </div>

      </div>
    </div>
  );
};

export default CardKelas;
