import React, { FC } from "react";

interface CardJadwalProps {
  nama_Kelompok: string;
  nama_tentor: string;
  kelas: string;
  tipe: string;
}

const CardJadwal: FC<CardJadwalProps> = ({
  nama_Kelompok,
  nama_tentor,
  kelas,
  tipe,
}) => {
  return (
    <div className="flex flex-col bg-Neutral-100 border rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl text-Neutral-10 font-bold">6A</h1>
          <span className="text-Neutral-30">Private</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <h3 className="text-sm text-Neutral-30">Sesi</h3>
          <span className="font-bold text-sm text-Primary-10">1</span>
        </div>
      </div>
    </div>
  );
};

export default CardJadwal;
