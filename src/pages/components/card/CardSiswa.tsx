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
              src={gambar ? gambar : "/img/user/default.png"}
              alt="Megachan"
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
        {/* <a
          href={whatsapp}
          title="hubungi customer"
          type="button"
          target="_blank"
          id="whatsapp"
          className="bg-[#4FCF2F] text-neutral_050 shadow-elevation-light-2  hover:bg-[#81FF62] focus:bg-[#4FCF2F]/80 w-11/12 h-12 rounded-2xl flex flex-row gap-3 justify-center items-center"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.988 0C5.436 0 0.0960002 5.34 0.0960002 11.892C0.0960002 13.992 0.648 16.032 1.68 17.832L0 24L6.3 22.344C8.04 23.292 9.996 23.796 11.988 23.796C18.54 23.796 23.88 18.456 23.88 11.904C23.88 8.724 22.644 5.736 20.4 3.492C18.156 1.236 15.168 0 11.988 0ZM12 2.004C14.64 2.004 17.112 3.036 18.984 4.908C20.844 6.78 21.876 9.264 21.876 11.904C21.876 17.352 17.436 21.78 11.988 21.78C10.212 21.78 8.472 21.312 6.96 20.4L6.6 20.196L2.856 21.18L3.852 17.532L3.612 17.148C2.628 15.6 2.1 13.764 2.1 11.892C2.112 6.444 6.54 2.004 12 2.004ZM7.776 6.396C7.584 6.396 7.26 6.468 6.984 6.768C6.72 7.068 5.94 7.8 5.94 9.252C5.94 10.716 7.008 12.12 7.14 12.324C7.308 12.528 9.252 15.528 12.24 16.8C12.948 17.124 13.5 17.304 13.932 17.436C14.64 17.664 15.288 17.628 15.804 17.556C16.38 17.472 17.556 16.836 17.808 16.14C18.06 15.444 18.06 14.856 17.988 14.724C17.904 14.604 17.712 14.532 17.412 14.4C17.112 14.232 15.648 13.512 15.384 13.416C15.108 13.32 14.94 13.272 14.712 13.56C14.52 13.86 13.944 14.532 13.776 14.724C13.596 14.928 13.428 14.952 13.14 14.808C12.828 14.652 11.868 14.34 10.74 13.332C9.852 12.54 9.264 11.568 9.084 11.268C8.94 10.98 9.072 10.8 9.216 10.668C9.348 10.536 9.54 10.32 9.66 10.14C9.816 9.972 9.864 9.84 9.96 9.648C10.056 9.444 10.008 9.276 9.936 9.132C9.864 9 9.264 7.512 9.012 6.924C8.772 6.348 8.532 6.42 8.34 6.408C8.172 6.408 7.98 6.396 7.776 6.396Z"
              fill="#FAFAFA"
            />
          </svg>
          <h1>WhatsApp {nama_siswa} </h1>
        </a> */}
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
          <Link href={"/detailProfileSiswa"}>
            <Button
              type="button"
              bgColor="bg-Primary-50"
              brColor=""
              label="Detail Data"
              textColor="text-Primary-20"
              icon={IoIosArrowForward}
            />
          </Link>
        </div>
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
