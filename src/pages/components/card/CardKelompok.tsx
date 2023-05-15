import Image from "next/image";
import { FC } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface CardKelompokProps {
  level: string;
  tipe: string;
  nama_kelompok: string;
  onClick: () => void;
}

const CardKelompok: FC<CardKelompokProps> = ({
  nama_kelompok,
  tipe,
  level,
  onClick,
}) => {
  return (
    <div className="flex flex-col bg-Neutral-100 border rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl text-Neutral-10 font-bold">{nama_kelompok}</h1>
          <span className="text-Neutral-30">{level}</span>
        </div>
        <h3 className="text-sm text-Neutral-30 font-bold">{tipe}</h3>
      </div>
      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Button
            bgColor="bg-Primary-50"
            brColor=""
            label="Detail Anggota"
            textColor="text-Primary-20"
            type="button"
            icon={IoIosArrowForward}
          />
          <Button
            bgColor="bg-Primary-50"
            brColor=""
            label="Lihat Jadwal"
            textColor="text-Primary-20"
            type="button"
            icon={IoIosArrowForward}
          />
        </div>
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Kelompok"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default CardKelompok;
