import Image from "next/image";
import React, { FC, useState } from "react";
import { HiOutlineCheck } from "react-icons/hi";

type CardTambahJadwalKelompokProps = {
  // nama_siswa: string;
};

const CardTambahJadwalKelompok: FC<CardTambahJadwalKelompokProps> = ({}) => {
  const [check, setcheck] = useState(false);

  const handleCheck = () => {
    setcheck(!check);
  };
  return (
    <div onClick={handleCheck}>
      <div
        className={`flex flex-col gap-2 p-2 border-[2px] ${
          check ? "border-Primary-40" : ""
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
              className={`p-1 h-6 w-6 rounded-full ${
                check ? "bg-Primary-40" : "bg-Neutral-95"
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
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm text-Neutral-70">Hari</h3>
            <span className="font-bold">Senin</span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <h3 className="text-sm text-Neutral-70">Sesi</h3>
            <span className="font-bold">1</span>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm text-Neutral-70">Ruang</h3>
            <span className="font-bold">B</span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <h3 className="text-sm text-Neutral-70">Mata Pelajaran</h3>
            <span className="font-bold">Matematika</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTambahJadwalKelompok;
