import React, { FC } from "react";
import Button from "../buttons/Button";
import { MdDelete, MdModeEdit } from "react-icons/md";

type CardSesiProps = {
  nama_sesi: string;
  mulai_sesi: string;
  selesai_sesi: string;
  onClick: () => void;
  onDelete?: () => void;
};

const CardSesi: FC<CardSesiProps> = ({
  nama_sesi,
  mulai_sesi,
  selesai_sesi,
  onClick,
  onDelete,
}) => {
  return (
    <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 ">
          <h3 className="text-sm text-Neutral-30">Sesi</h3>
          <span className="font-bold text-Primary-10 capitalize">{nama_sesi}</span>
        </div>
        <div className="flex flex-col items-end gap-1 justify-end">
          <h3 className="text-sm text-Neutral-30">Jam</h3>
          <span className="font-bold  text-Primary-10">
            {mulai_sesi} - {selesai_sesi}
          </span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-Neutral-70"></div>
      <div className="flex justify-end">
        <Button
          type="button"
          bgColor="bg-Error-50"
          brColor=""
          label="Hapus Sesi"
          textColor="text-Error-50"
          icon={MdDelete}
          onClick={onDelete}
        />
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Sesi"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default CardSesi;
