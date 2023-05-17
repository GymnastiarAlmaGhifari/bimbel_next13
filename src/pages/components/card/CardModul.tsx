import Image from "next/image";
import { FC } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import Kelas from "@/pages/pengaturan/kelas";
import { string } from "yup";
import { IoIosArrowForward } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";

interface CardModulProps {
  nama_modul: string;
  tanggal_upload: string;
  nama_penyusun: string;
  tipe: string;
  kelompok: string;
  url: string;
  thumbnail: string;
  tingkatan: string;
  mapel: string;
  onClick?: () => void;
}

const CardModul: FC<CardModulProps> = ({
  onClick,
  kelompok,
  nama_modul,
  mapel,
  nama_penyusun,
  tingkatan,
  tipe,
  tanggal_upload,
  thumbnail,
  url,
}) => {
  const detailProfile = () => {
    window.location.href = "/detailProfileSiswa";
  };
  return (
    <div className="flex flex-col bg-Neutral-100 border rounded-lg py-5 px-4 gap-3">
      <div className="flex gap-5">
        <div className="h-full w-40">
          <Image
            src={
              thumbnail
                ? thumbnail
                : "https://img.jakpost.net/c/2019/08/09/2019_08_09_77763_1565315121._large.jpg"
            }
            alt="Megachan"
            width={100}
            height={100}
            className="rounded-lg w-full h-full object-cover"
            loader={({ src }) => `${src}?cache-control=no-store`}
          />
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="">
            <h1 className="text-xl font-bold text-Primary-10">{nama_modul}</h1>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm text-Neutral-30">Mata Pelajaran</h3>
              <span className="font-bold text-sm text-Primary-10">{mapel}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-sm text-Neutral-30">Tanggal Upload</h3>
              <span className="font-bold text-sm text-Primary-10">
                {tanggal_upload}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <h3 className="text-sm text-Neutral-30">Penyusun</h3>
              <span className="font-bold text-sm text-Primary-10">
                {nama_penyusun}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm text-Neutral-30">Tingkatan</h3>
              <span className="font-bold text-sm text-Primary-10">
                {tingkatan}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-sm text-Neutral-30">Tipe</h3>
              <span className="font-bold text-sm text-Primary-10">{tipe}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <h3 className="text-sm text-Neutral-30">Kelompok</h3>
              <span className="font-bold text-sm text-Primary-10">
                {kelompok}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <div className="flex justify-end items-center">
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Modul"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          // onClick={onClick}
        />
      </div>
    </div>
  );
};

export default CardModul;
