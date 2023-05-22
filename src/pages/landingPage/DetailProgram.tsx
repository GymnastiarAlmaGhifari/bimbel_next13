"use client";
import { Inter } from "next/font/google";
import { IoIosArrowBack } from "react-icons/io";
import Button from "../components/buttons/Button";
import Link from "next/link";

export default function DetailProgram() {
  return (
    <div className="h-auto flex px-6 gap-4 pt-14">
      <div className=" w-64">
        <Link href="/">
          <IoIosArrowBack size={48} />
        </Link>
      </div>
      <div className="w-full pb-14">
        <p className="text-3xl">Tingkatan</p>
        <p className="text-5xl font-bold text-Primary-20 mb-9">
          Mapel yang diajarkan
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
          laudantium ipsum facilis dignissimos placeat dolores illum, facere
          sapiente expedita iste excepturi id dicta impedit repudiandae incidunt
          omnis necessitatibus quo voluptatum ratione at dolor mollitia enim
          provident. Tempora perspiciatis saepe aliquid!
        </p>
        <div className="mt-14">
          <span>Tersedia untuk kelas</span>
          <div className="flex gap-2">
            <div className="bg-Primary-50 h-16 w-16 flex justify-center items-center text-3xl font-bold text-Primary-10 rounded">
              I
            </div>
            <div className="bg-Primary-50 h-16 w-16 flex justify-center items-center text-3xl font-bold text-Primary-10 rounded">
              II
            </div>
            <div className="bg-Primary-50 h-16 w-16 flex justify-center items-center text-3xl font-bold text-Primary-10 rounded">
              III
            </div>
            <div className="bg-Primary-50 h-16 w-16 flex justify-center items-center text-center text-3xl font-bold text-Primary-10 rounded">
              IV
            </div>
          </div>
        </div>
        <div className="mt-14">
          <span>Spesial harga untuk Anda</span>
          <div className="flex h-20 justify-center items-center text-4xl font-bold text-Primary-10 bg-Primary-50 rounded-full">
            Rp. 000.000,-
          </div>
        </div>
      </div>
      <div className="w-full relative">
        <div className="h-56 w-40 bg-slate-500 absolute bottom-0 right-0"></div>
      </div>
    </div>
  );
}
