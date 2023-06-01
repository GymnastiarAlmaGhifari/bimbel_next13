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
    <div className="flex flex-col justify-center w-full h-full relative group">
      <div className="h-full w-full justify-center flex flex-col gap-2 p-2">
        <div className="flex flex-col">
          <h1 className="text-sm">kelompok</h1>
          <p className="text-Tertiary-99 font-bold">{kelompok}</p>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm">tentor</h1>
          <p className="text-Tertiary-99 font-bold">{nama_tentor}</p>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm">mapel</h1>
          <p className="text-Tertiary-99 font-bold">{nama_mapel}</p>
        </div>
      </div>
      <div className="hidden group-hover:flex items-center justify-center absolute gap-4 w-full h-full bg-Neutral-0 bg-opacity-50 rounded-lg">
        <button
          className="text-Tertiary-99 hover:text-Tertiary-40"
          onClick={onClick}
        >
          <MdModeEdit size={28} />
        </button>
        <button
          className="text-Tertiary-99 hover:text-Error-40"
          onClick={onDelete}
        >
          <MdDelete size={28} />
        </button>
      </div>
    </div>
  );
};

export default ItemJadwalTerisi;

export const ItemJadwalBelumTerisi: FC<ItemJadwalBelumTerisiProps> = ({
  onClick,
}) => {
  return (
    <div className="group flex flex-col justify-center w-full h-full">
      <p className=" h-full flex items-center justify-center">
        Tidak Ada Jadwal
      </p>
      {/* button tambah jadwal */}
      <div className="hidden group-hover:flex absolute w-full h-full items-center justify-center bg-Neutral-0 bg-opacity-50 rounded-lg">
        <button
          className="hover:text-Tertiary-40 text-Error-99"
          onClick={onClick}
        >
          <IoIosAdd size={40} />
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

export const ItemJadwalLoading = () => {
  return <div className="w-full h-full bg-Error-30 rounded-lg"></div>;
};
