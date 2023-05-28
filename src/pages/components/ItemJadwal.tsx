import React, { FC } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Button from "./buttons/Button";
import { IoIosAdd } from "react-icons/io";

type ItemJadwalTerisiProps = {
  nama_mapel: string;
  kelompok: string;
  nama_tentor: string;
  onClick?: () => void;
  onDelete?: () => void;
};
type ItemJadwalBelumTerisiProps = {
  onClick?: () => void;
};

const ItemJadwalTerisi: FC<ItemJadwalTerisiProps> = ({
  kelompok,
  nama_tentor,
  onClick,
  onDelete,
  nama_mapel,
}) => {
  return (
    <div className="flex flex-col justify-center w-full h-full">
      <div className="h-full w-full flex flex-col gap-1">
        <h1>kelompok</h1>
        <p className="text-Tertiary-99 font-bold text-[18px]">{kelompok}</p>
        <h1>tentor</h1>
        <p className="text-Tertiary-99 font-bold text-[18px]">{nama_tentor}</p>
        <h1>mapel</h1>
        <p className="text-Tertiary-99 font-bold text-[18px]">{nama_mapel}</p>
        <div className="flex flex-col justify-end items-end absolute bottom-2 right-2 gap-2">
          <button className="text-Tertiary-99 hover:text-Tertiary-40" onClick={onClick}>
            <MdModeEdit size={28} />
          </button>
          <button className="text-Tertiary-99 hover:text-Error-40" onClick={onDelete}>
            <MdDelete size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemJadwalTerisi;

export const ItemJadwalBelumTerisi: FC<ItemJadwalBelumTerisiProps> = ({
  onClick,
}) => {
  return (
    <div className="flex flex-col justify-center w-full h-full">
      <p className=" h-full flex items-center justify-center">
        Tidak Ada Jadwal
      </p>
      {/* button tambah jadwal */}
      <div className="absolute bottom-0 right-2">
        <button className="hover:text-Tertiary-40" onClick={onClick}>
          <IoIosAdd size={24} />
        </button>
        {/* <Button
          bgColor="bg-Neutral-100"
          brColor=""
          label=""
          noLabel
          textColor="text-Error-95"
          icon={IoIosAdd}
          type={"button"}
          onClick={onClick}
        /> */}
      </div>
    </div>
  );
};
