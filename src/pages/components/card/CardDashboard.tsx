import React, { FC } from "react";

type CardDashboardProps = {
  nama_sesi?: string;
  nama_kelompok?: string;
  nama_mapel?: string;
  nama_tentor?: string;
  nama_program?: string;
};

const CardDashboard: FC<CardDashboardProps> = ({
  nama_sesi,
  nama_kelompok,
  nama_mapel,
  nama_tentor,
  nama_program,
}) => {
  return (
    <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl text-Neutral-10 font-bold">{nama_kelompok}</h1>
          <span className="text-Neutral-30">{nama_program}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <h3 className="text-sm text-Neutral-30">Sesi</h3>
          <span className="font-bold text-sm text-Primary-10">{nama_sesi}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">nama tentor</h3>
          <span className="font-bold text-sm text-Primary-10">{nama_tentor}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-sm text-Neutral-30">nama mapel</h3>
          <span className="font-bold text-sm text-Primary-10">{nama_mapel}</span>
        </div>
      </div>
    </div>
  );
};

export default CardDashboard;
