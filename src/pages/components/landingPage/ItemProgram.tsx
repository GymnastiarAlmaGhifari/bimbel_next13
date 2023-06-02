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
    <>
    <div className="group bg-Neutral-100 rounded-lg pb-3 h-auto overflow-hidden w-full relative">
      <div className="w-full h-96 overflow-clip">
        <Image
          className="w-full h-full object-cover"
          src={
            gambar ? "/api/program/img?img=" + gambar : "/img/user/default.png"
          }
          alt="gambar program"
          width={500}
          height={500}
          loader={({ src }) => `${src}?cache-control=no-store`}
        />
      </div>
      <span className="text-3xl font-bold text-Primary-10 absolute top-2 left-2">
        {nama_kelas}
      </span>

      <div className="translate-y-[100%] group-hover:translate-y-10 h-auto transition-all absolute bottom-10 w-full">
        <span className="font-bold text-Neutral-100 h-10 flex items-center justify-center w-max inline-block pl-4 pr-10 bg-gradient-to-br from-Tertiary-60 to-Primary-60 rounded-tr-full">
          {harga}
        </span>

        <div className="flex flex-col gap-2 px-5 py-4 bg-Neutral-100">
          <div className="flex justify-between">
            <span className="font-bold text-Primary-10">{nama_program}</span>
            <div className="flex gap-1 items-center">
              <span className="font-semibold text-Primary-10">{level}</span>
              <div className="h-4 w-[2px] bg-Neutral-70"></div>
              <span className="font-semibold text-Primary-10">{tipe}</span>
            </div>
          </div>
          <span className=" text-Primary-10">{deskripsi}</span>
        </div>
      </div>
    </div>
    </>
  );
};

export default ItemProgram;
