import Image from "next/image";
import { FC } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import Kelas from "@/pages/pengaturan/kelas";
import { string } from "yup";
import { IoIosArrowForward } from "react-icons/io";

interface CardSiswaProps {
  nama_siswa: string;
  status: string;
  kelompok: string;
  kelas: string;
  onEdit?: () => void;
  onDelete?: () => void;
  tipe: string;
  gambar?: any;
}

const CardSiswa: FC<CardSiswaProps> = ({
  onEdit,
  onDelete,
  tipe,
  gambar,
  kelas,
  kelompok,
  nama_siswa,
  status,
}) => {
  const detailProfile = () => {
    window.location.href = "/detailProfileSiswa";
  };
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
              <h3 className="text-Neutral-30">{tipe}</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 justify-center">
          <h3 className="text-sm text-Neutral-30">Kelas</h3>
          <span className="font-bold text-sm text-Primary-10">{kelas}</span>
        </div>
        <div className="flex flex-col items-end gap-1 justify-center">
          <h3 className="text-sm text-Neutral-30">Kelompok</h3>
          <span className="font-bold text-sm text-Primary-10">{kelompok}</span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-Primary-30">{status}</h2>
        <Button
          type="button"
          bgColor="bg-Primary-50"
          brColor=""
          label="Detail Data"
          textColor="text-Primary-20"
          icon={IoIosArrowForward}
          onClick={detailProfile}
        />
      </div>
    </div>
  );
};

export default CardSiswa;
