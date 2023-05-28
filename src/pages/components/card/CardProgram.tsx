import React, { FC } from "react";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";
import Image from "next/image";

type CardProgramProps = {
  nama_program: string;
  mapel_ajar: string;
  level: string;
  deskripsi?: string;
  tipe: string;
  kelas: string;
  harga: number;
  gambar?: string;
  onEdit: () => void;
};

const CardProgram: FC<CardProgramProps> = ({
  nama_program,
  kelas,
  level,
  deskripsi,
  tipe,
  harga,
  gambar,
  mapel_ajar,
  onEdit,
}) => {
  const formattedHarga = harga
    ? harga
        .toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })
        .replace(",00", "")
    : "";

  return (
    <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <h1 className="text-Neutral-10 text-lg font-bold capitalize">
          {nama_program}
        </h1>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Kelas</h3>
          <span className="font-bold text-Primary-10">{kelas}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <h3 className="text-sm text-Neutral-30">
            Mata Pelajaran yang Diajar
          </h3>
          <span className="font-bold text-Primary-10">{mapel_ajar}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Level</h3>
          <span className="font-bold text-Primary-10">{level}</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <h3 className="text-sm text-Neutral-30">Tipe</h3>
          <span className="font-bold text-Primary-10">{tipe}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm text-Neutral-30">Deskripsi</h3>
        <span className="font-bold text-Primary-10">{deskripsi}</span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm text-Neutral-30">harga</h3>
        <span className="font-bold text-Primary-10">{formattedHarga}</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-6 w-[400px] bg-red-500 rounded-lg">
          <Image
            src={"/img/user/default.png"}
            alt="Gambar"
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>
      </div>
      <div className="w-full h-[1px] bg-Neutral-70"></div>
      <div className="flex justify-end">
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Program"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          onClick={onEdit}
        />
      </div>
    </div>
  );
};

export default CardProgram;
