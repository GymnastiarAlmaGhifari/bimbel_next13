"use client";

import { Inter } from "next/font/google";
import Image from "next/image";

interface tentorProps {
  nama: string;
  institut: string;
  mataPelajaran: string;
  profile: string;
  wAuto?: boolean;
  wFull?: boolean;
}

const Tentor: React.FC<tentorProps> = ({
  nama,
  institut,
  mataPelajaran,
  profile,
  wAuto,
}) => {
  const cardStyle = "";

  return (
    <div
      className={`flex flex-row h-40 gap-5 shadow-[4px_4px_8px_1px_rgba(101,186,177,0.3)] ${
        wAuto ? "w-full" : "w-72"
      } rounded-lg bg-Neutral-100`}
    >
      <div className="w-32 overflow-clip h-full">
        <Image
          src={
            profile ? "/api/user/img?img=" + profile : "/img/user/default.png"
          }
          alt="Profile Tentor"
          width={500}
          height={500}
          className="rounded-l-lg w-full h-full object-cover"
          loader={({ src }) => `${src}?cache-control=no-store`}
        />
      </div>
      <div className="flex flex-col gap-1 py-2">
        <h2 className="font-semibold ">{nama}</h2>
        <div>
          <p className="text-sm opacity-70 ">Asal Institut</p>
          <p>{institut ? institut : "-"}</p>
        </div>
        <div>
          <p className="text-sm opacity-70 ">Mata Pelajaran</p>
          <p>{mataPelajaran}</p>
        </div>
      </div>
    </div>
  );
};

export default Tentor;
