import Search from "@/pages/components/Search";
import Button from "@/pages/components/buttons/Button";
import CardTambahAnggotaKelompok from "@/pages/components/card/CardTambahAnggotakelompok";
import Image from "next/image";
import React, { FC, useState } from "react";
import { HiOutlineCheck } from "react-icons/hi";

type AnggotaProps = {
  // nama_siswa: string;
};

const Anggota: FC<AnggotaProps> = ({}) => {
  const [check, setcheck] = useState(false);

  const handleCheck = () => {
    setcheck(!check);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-6 gap-4">
        <CardTambahAnggotaKelompok />
        <CardTambahAnggotaKelompok />
        <CardTambahAnggotaKelompok />
        <CardTambahAnggotaKelompok />
        <CardTambahAnggotaKelompok />
        <CardTambahAnggotaKelompok />
      </div>
      <div className="w-full h-[1px] bg-Neutral-70"></div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="font-semibold text-lg text-Primary-20">
            Siswa Tanpa Kelompok
          </p>
          <Search/>
        </div>
        <div className=" h-80 overflow-auto scrollbar pr-2 ">
          <div className="grid grid-cols-6 gap-4 ">
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
            <CardTambahAnggotaKelompok />
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-4">
          <Button
            center
            bgColor="bg-Neutral-70"
            brColor=""
            label="Batal"
            textColor="text-Neutral-30"
            type="button"
            // onClick={onClose}
          />
          <Button
            type="submit"
            bgColor="bg-Tertiary-50"
            brColor=""
            label="Konfirmasi"
            textColor="text-Neutral-100"
            withBgColor
          />
        </div>
      </div>
    </div>
  );
};

export default Anggota;
