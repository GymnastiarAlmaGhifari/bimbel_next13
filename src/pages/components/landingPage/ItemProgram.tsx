import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { IoIosArrowForward } from "react-icons/io";

interface ItemProgram {
  deskripsi?: string;
  gambar?: string;
  tipe?: string;
  level?: string;
  harga?: number;
  nama_program?: string;
  nama_kelas?: string;
}


const ItemProgram: FC<ItemProgram> = ({
  deskripsi, gambar, tipe, level, harga, nama_program, nama_kelas,
}) => {
  return (
    <div className="bg-Neutral-100 rounded-lg pb-3 h-auto overflow-hidden w-full ">
      <div className="relative">
        <Image
          className="w-full"
          src={gambar ? "/api/program/img?img=" + gambar : "/img/user/default.png"}
          alt="gambar program"
          width={500}
          height={500}
          loader={({ src }) => `${src}?cache-control=no-store`}
        />
        <span className="text-3xl font-bold text-Primary-10 absolute top-2 left-2">
          {nama_program}
        </span>
      </div>
      <div className="flex justify-between px-4 pt-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Kelas</h3>
          <span className="font-bold text-Primary-10">{nama_kelas}</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <h3 className="text-sm text-Neutral-30">Level</h3>
          <span className="font-bold text-Primary-10">{level}</span>
        </div>
      </div>
      <div className="flex justify-between px-4 pt-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Tipe</h3>
          <span className="font-bold text-Primary-10">{tipe}</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <h3 className="text-sm text-Neutral-30">Harga</h3>
          <span className="font-bold text-Primary-10">{harga}</span>
        </div>
      </div>
      <div className="flex justify-between px-4 pt-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Deskripsi</h3>
          <span className="font-bold text-Primary-10">{deskripsi}</span>
        </div>
      </div>
    </div>
  );
}

export default ItemProgram;