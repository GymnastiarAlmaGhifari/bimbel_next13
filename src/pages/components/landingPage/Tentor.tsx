"use client";

import { Inter } from "next/font/google";
import Image from 'next/image'

interface tentorProps {
  nama: string;
  institut: string;
  mataPelajaran: string;
  profile: string;
}

const Tentor: React.FC<tentorProps> = ({
  nama,
  institut,
  mataPelajaran,
  profile,
}) => {
  const cardStyle = "";

  return (
    <div className="flex flex-row h-36 gap-5">
        <div>
          <Image src={profile} alt="Profile Tentor" width={500} height={500} className=" w-32 h-full rounded" />
        </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold ">{nama}</h2>
        <div>
          <p className="text-sm opacity-70 ">Asal Institut</p>
          <p>{institut}</p>
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
