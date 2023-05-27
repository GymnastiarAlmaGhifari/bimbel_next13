import React, { FC } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Button from "./buttons/Button";
import { IoIosAdd } from "react-icons/io";

type ItemJadwalTerisiProps = {
  hari: string;
  kelompok: string;
  nama_tentor: string;
  onClick?: () => void;
};
type ItemJadwalBelumTerisiProps = {
  onClick?: () => void;
};

const ItemJadwalTerisi: FC<ItemJadwalTerisiProps> = ({
  kelompok,
  nama_tentor,
  onClick,
  hari,
}) => {
  return (
    <div className="flex flex-col justify-center w-full h-full">
      <div className="h-full w-full flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-Tertiary-90 font-bold">{hari}</p>
          <p className="text-Tertiary-90 font-bold">{kelompok}</p>
        </div>
        <p className="text-Tertiary-90 font-bold">{nama_tentor}</p>
      </div>
      <div className="flex absolute bottom-2 right-2 gap-2">
        {/* <Button
          bgColor="bg-Neutral-100"
          brColor=""
          label=""
          noLabel
          textColor="text-Tertiary-90"
          icon={MdDelete}
          type={"button"}
          // onClick={onClick}
        /> */}
        <button className="hover:text-Error-40" onClick={onClick}>
          <MdDelete size={24} />
        </button>
        <button className="hover:text-Tertiary-40" onClick={onClick}>
          <MdModeEdit size={24} />
        </button>
        {/* <Button
          bgColor="bg-Neutral-100"
          brColor=""
          label=""
          noLabel
          textColor="text-Tertiary-90"
          type={"button"}
          icon={MdModeEdit}
          // onClick={onClick}
        /> */}
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
