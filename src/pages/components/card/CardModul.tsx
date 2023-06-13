import Image from "next/image";
import { FC } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import Kelas from "@/pages/pengaturan/kelas";
import { string } from "yup";
import { IoIosArrowForward } from "react-icons/io";
import { MdModeEdit, MdDelete, MdVisibility } from "react-icons/md";

interface CardModulProps {
  nama_module: string;
  tanggal_upload: string;
  kelompok: string;
  url: string;
  thumbnail: string;
  tingkatan: string;
  mapel: string;
  goPdf?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CardModul: FC<CardModulProps> = ({
  onEdit,
  kelompok,
  nama_module,
  mapel,
  tingkatan,
  tanggal_upload,
  thumbnail,
  goPdf,
  url,
  onDelete,
}) => {
  const detailProfile = () => {
    window.location.href = "/detailProfileSiswa";
  };


  return (
    <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3">
      <div className="flex gap-5">
        <div className="h-full w-40">
          <Image
            src={"/api/modul/thumb?img=" + thumbnail + "&&time=" + Date.now() ? "/api/modul/thumb?img=" + thumbnail + "&&time=" + Date.now() : "/img/user/default.png"}
            alt="Megachan"
            width={100}
            height={100}
            className="rounded-lg w-full h-full object-cover"
            loader={({ src }) => `${src}?cache-control=no-store`}
          />
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm text-Neutral-30">Nama Modul</h3>
              <span className="font-bold text-Primary-10">{nama_module}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm text-Neutral-30">Mata Pelajaran</h3>
              <span className="font-bold text-Primary-10">{mapel}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-sm text-Neutral-30">Tanggal Upload</h3>
              <span className="font-bold text-Primary-10">
                {tanggal_upload}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <h3 className="text-sm text-Neutral-30">Penyusun</h3>
              <span className="font-bold  text-Primary-10">
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm text-Neutral-30">Tingkatan</h3>
              <span className="font-bold text-Primary-10">{tingkatan}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <h3 className="text-sm text-Neutral-30">Kelompok</h3>
              <span className="font-bold text-Primary-10">{kelompok}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-Neutral-70"></div>
      <div className="flex justify-end gap-4 items-center">
        <Button
          type="button"
          bgColor="bg-Primary-50"
          brColor=""
          label="Lihat Modul"
          textColor="text-Primary-40"
          icon={MdVisibility}
          onClick={goPdf}
        />
        <Button
          type="button"
          bgColor="bg-Error-50"
          brColor=""
          label="Hapus Modul"
          textColor="text-Error-40"
          icon={MdDelete}
          onClick={onDelete}
        />
        <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Modul"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          onClick={onEdit}
        />
      </div>
    </div>
  );
};

export default CardModul;
