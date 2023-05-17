import Image from "next/image";
import { FC } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import Kelas from "@/pages/pengaturan/kelas";
import { string } from "yup";
import { IoIosArrowForward, IoLogoWhatsapp } from "react-icons/io";
import { MdDelete, MdModeEdit } from "react-icons/md";


interface CardSiswaProps {
  nama_siswa: string;
  nama_kelompok: string;
  hp: string;
  level: string;
  kelas: string;
  onEdit?: () => void;
  onDelete?: () => void;
  tipe: string;
  gambar?: any;
}

const CardSiswa: FC<CardSiswaProps> = ({
  onEdit,
  onDelete,
  nama_kelompok,
  tipe,
  gambar,
  kelas,
  level,
  nama_siswa,
  hp,
}) => {
  const detailProfile = () => {
    window.location.href = "/detailProfileSiswa";
  };
  const openWhatsapp = () => {
    window.open("https://wa.me/+6281234812036");
  };

//  const noHP = hp;
//  const whatsapp = "https://wa.me/62" + noHP + "?text=Hello";

  return (
    <div className="flex flex-col bg-Neutral-100 border rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex items-center h-max w-auto gap-3">
          <div className="h-20 w-20">
            <Image
              src={
                gambar
                  ? gambar
                  : "https://img.jakpost.net/c/2019/08/09/2019_08_09_77763_1565315121._large.jpg"
              }
              alt="Megachan"
              width={100}
              height={100}
              className="rounded-full w-full h-full object-cover"
              loader={({ src }) => `${src}?cache-control=no-store`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className=" text-Neutral-10 font-bold">{nama_siswa}</h1>
            <div className="flex flex-col  gap-1">
              <h3 className="text-Neutral-30">{nama_kelompok}</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 justify-center">
          <h3 className="text-sm text-Neutral-30">Kelas</h3>
          <span className="font-bold text-sm text-Primary-10">{kelas}</span>
        </div>
        <div className="flex flex-row gap-3 mt-">
          <div className="flex flex-col items-start gap-1 justify-center">
            <span className="font-bold text-sm text-Primary-10">{tipe}</span>
          </div>
          <div className="flex flex-col items-start gap-1 justify-center">
            <span className="font-bold text-sm text-Primary-10">{level}</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <div className="flex justify-between items-center">

        <Button
          bgColor="bg-Primary-50"
          brColor=""
          label="Whatsapp Siswa"
          textColor="text-Primary-20"
          type="button"
          icon={IoLogoWhatsapp}
          onClick={openWhatsapp}
        />
        <Button
          type="button"
          bgColor="bg-Primary-50"
          brColor=""
          label="Detail Data"
          textColor="text-Primary-20"
          icon={IoIosArrowForward}
          onClick={detailProfile}
        />
        <div className="flex flex-row gap-3">
          <Button
            type="button"
            bgColor="bg-Tertiary-50"
            brColor=""
            label="Edit Siswa"
            textColor="text-Tertiary-50"
            icon={MdModeEdit}
            onClick={onEdit}
          />
          <Button
            bgColor="bg-Error-50"
            brColor=""
            label="Hapus Siswa"
            textColor="text-Error-40"
            type="button"
            icon={MdDelete}
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default CardSiswa;
