import React, { FC } from "react";

type InfoDashboardProps = {
  bgStart: string;
  bgEnd: string;
  label: string;
  value: string;
};

const ItemInfoDashboard: FC<InfoDashboardProps> = ({
  label,
  value,
  bgEnd,
  bgStart,
}) => {
  const ItemStyle = `flex justify-center items-center w-full rounded-lg relative bg-gradient-to-r from-Primary-50 to-Primary-90`;
  return (
    <div className={ItemStyle}>
      <h1 className="absolute top-2 left-2 text-Primary-20 text-sm">{label}</h1>
      <h2 className="text-3xl font-bold text-Primary-20">{value}</h2>
    </div>
  );
};

export default ItemInfoDashboard;
