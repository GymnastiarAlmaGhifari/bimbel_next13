import Image from "next/image";
import React, { FC, useState } from "react";
import { HiOutlineCheck } from "react-icons/hi";

type CardTambahAnggotaKelompokProps = {
  // nama_siswa: string;
};

const CardTambahAnggotaKelompok: FC<CardTambahAnggotaKelompokProps> = ({ }) => {
  const [check, setcheck] = useState(false);

  const handleCheck = () => {
    setcheck(!check);
  };
  return (
    <div onClick={handleCheck}>
      <div
        className={`flex flex-col gap-2 p-2 border-[2px] ${check ? "border-Primary-40" : ""
          } w-full rounded-lg items-center bg-Neutral-100`}
      >
        <div className="flex justify-end w-full ">
          <input
            type="checkbox"
            name=""
            id="check"
            className="appearance-none"
          />
          <label htmlFor="check">
            <div
              className={`p-1 h-6 w-6 rounded-full ${check ? "bg-Primary-40" : "bg-Neutral-95"
                }`}
              onClick={handleCheck}
            >
              {check ? (
                <HiOutlineCheck strokeWidth={3} className="text-Neutral-100" />
              ) : (
                ""
              )}
            </div>
          </label>
        </div>
        <div className="w-16 h-16 rounded-full overflow-clip scale-100 bg-red-400">
          <Image
            alt="Foto Siswa"
            src={
              "https://indopolitika.com/wp-content/uploads/2014/05/Puan-Maharani.jpg"
            }
            height={500}
            width={500}
            className="rounded-full w-full h-full object-cover"
          />
        </div>
        <div className="">
          <p className="font-bold text-center">Agimul Karim</p>
          <p className="text-sm text-center">08512345678</p>
        </div>
      </div>
    </div>
  );
};

export default CardTambahAnggotaKelompok;
