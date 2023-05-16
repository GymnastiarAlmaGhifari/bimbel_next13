import React, { FC } from "react";

type InfoDashboardProps = {
  bgStart: string;
  bgEnd: string;
  label: string;
  value: string;
  textColor: string;
};

const ItemInfoDashboard: FC<InfoDashboardProps> = ({
  label,
  value,
  bgEnd,
  bgStart,
  textColor,
}) => {
  const ItemStyle = `flex justify-center items-center w-full rounded-lg relative bg-gradient-to-r ${bgStart} ${bgEnd}`;
  return (
    <div className={ItemStyle}>
      <h1 className={`absolute top-2 left-2 ${textColor} text-sm`}>{label}</h1>
      <h2 className={`text-3xl font-bold ${textColor}`}>{value}</h2>
    </div>
  );
};

export default ItemInfoDashboard;
