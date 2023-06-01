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
  deskripsi,
  gambar,
  tipe,
  level,
  harga,
  nama_program,
  nama_kelas,
}) => {
  return (
    <div className="bg-Neutral-100 rounded-lg pb-3 h-auto overflow-hidden w-full ">
      <div className="relative">
        <Image
          className="w-full bg-red-500"
          src={
            gambar ? "/api/program/img?img=" + gambar : "/img/user/default.png"
          }
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
        <span className="font-bold text-Primary-10">{nama_kelas}</span>
        <span className="font-bold text-Primary-10">{level}</span>
      </div>
      <span className="font-bold text-Primary-10">{tipe}</span>
      <span className="font-bold text-Primary-10">{harga}</span>
      <span className="font-bold text-Primary-10">{deskripsi}</span>
    </div>
  );
};

export default ItemProgram;
