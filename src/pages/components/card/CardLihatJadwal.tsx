import React, { FC } from "react";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";

interface CardLihatJadwalProps {
  nama_tentor: string;
  sesi: string;
  ruang: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

const CardLihatJadwal: FC<CardLihatJadwalProps> = ({
  nama_tentor,
  hari,
  jam_mulai,
  jam_selesai,
  ruang,
  sesi,
}) => {
  return (
    <div className="flex flex-col bg-Neutral-100 border rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <h1 className="text-xl text-Neutral-10 font-bold">{hari}</h1>
        <div className="flex flex-col items-end gap-1">
          <h3 className="text-sm text-Neutral-30">Sesi</h3>
          <span className="font-bold text-sm text-Primary-10">{sesi}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Ruang</h3>
          <span className="font-bold text-sm text-Primary-10">{ruang}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <h3 className="text-sm text-Neutral-30">Tentor</h3>
          <span className="font-bold text-sm text-Primary-10">
            {nama_tentor}
          </span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <div className="flex justify-between">
        <h2 className="font-bold text-Primary-30">
          {jam_mulai} - {jam_selesai}
        </h2>
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Jadwal"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          // onClick={onClick}
        />
      </div>
    </div>
  );
};

export default CardLihatJadwal;
