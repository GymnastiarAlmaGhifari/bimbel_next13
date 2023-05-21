import React, { FC } from "react";

type CardDashboardProps = {};

const CardDashboard: FC<CardDashboardProps> = ({}) => {
  return (
    <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3">
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
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Sesi</h3>
          <span className="font-bold text-sm text-Primary-10">1</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-sm text-Neutral-30">Sesi</h3>
          <span className="font-bold text-sm text-Primary-10">1</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <h3 className="text-sm text-Neutral-30">Sesi</h3>
          <span className="font-bold text-sm text-Primary-10">1</span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <h2 className="font-bold text-Primary-30">00:00 - 00:00</h2>
    </div>
  );
};

export default CardDashboard;
