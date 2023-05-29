import Image from "next/image";
import { FC } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import Kelas from "@/pages/pengaturan/kelas";
import { string } from "yup";
import { IoIosArrowForward, IoLogoWhatsapp } from "react-icons/io";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Link from "next/link";

interface CardSiswaProps {
  nama_siswa: string;
  nama_kelompok: string;
  hp: string;
  level: string;
  kelas: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  tipe: string;
  gambar?: any;
}

const CardSiswa: FC<CardSiswaProps> = ({
  onEdit,
  onDelete,
  onClick,
  nama_kelompok,
  tipe,
  gambar,
  kelas,
  level,
  nama_siswa,
  hp,
}) => {
  const noHP = hp;
  const whatsapp = "https://wa.me/62" + noHP + "?text=Hello";
  const openWhatsApp = () => {
    window.open(whatsapp);
  };

  return (
    <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex items-center h-max w-auto gap-3">
          <div className="h-14 w-14">
            <Image
              src={
                "/api/siswa/img?img=" + gambar
                  ? "/api/siswa/img?img=" + gambar
                  : "/img/user/default.png"
              }
              alt="image"
              width={100}
              height={100}
              className="rounded-full w-full h-full object-cover"
              loader={({ src }) => `${src}?cache-control=no-store`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className=" text-Neutral-10 font-bold capitalize">
              {nama_siswa}
            </h1>
            <div className="flex flex-col gap-1">
              <h3 className="text-Neutral-30">{nama_kelompok}</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-1 ">
          <h3 className="text-sm text-Neutral-30">Kelas</h3>
          <span className="font-bold text-Primary-10">{kelas}</span>
        </div>
        <div className="flex justify-center flex-col">
          <span className="font-bold text-Primary-10">
            {tipe} {level}
          </span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            bgColor="bg-Primary-50"
            brColor=""
            label={`Whatsapp ${nama_siswa}`}
            textColor="text-Primary-20"
            type="button"
            onClick={openWhatsApp}
            icon={IoLogoWhatsapp}
          />
          <Button
            type="button"
            bgColor="bg-Primary-50"
            brColor=""
            label="Detail Data"
            textColor="text-Primary-20"
            icon={IoIosArrowForward}
            onClick={onClick}
          />
        </div>
        <div className="flex flex-row gap-3">
          <Button
            bgColor="bg-Error-50"
            brColor=""
            label="Hapus Siswa"
            textColor="text-Error-40"
            type="button"
            icon={MdDelete}
            onClick={onDelete}
          />
          <Button
            type="button"
            bgColor="bg-Tertiary-50"
            brColor=""
            label="Edit Siswa"
            textColor="text-Tertiary-50"
            icon={MdModeEdit}
            onClick={onEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default CardSiswa;
