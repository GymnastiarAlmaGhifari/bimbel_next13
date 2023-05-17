import React, { FC } from "react";
import { MdModeEdit } from "react-icons/md";

type ItemJadwalProps = {
  kelompok: string;
  nama_tentor: string;
  onClick?: () => void;

};

const ItemJadwal: FC<ItemJadwalProps> = ({ kelompok, nama_tentor, onClick }) => {
  return (
    <div className="flex flex-col bg-Tertiary-50 rounded p-2">
      <div className="h-full">
        <p className="text-Tertiary-90 font-bold">{kelompok}</p>
        <p className="text-Tertiary-90">{nama_tentor}</p>
      </div>
      <div className="text-right">
        <button className="font-semibold text-Tertiary-90 p-2 rounded-full hover:bg-Tertiary-90/30">
          <MdModeEdit />
        </button>
      </div>
    </div>
  );
};

export default ItemJadwal;
