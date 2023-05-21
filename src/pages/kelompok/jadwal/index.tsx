import Search from "@/pages/components/Search";
import Button from "@/pages/components/buttons/Button";
import CardTambahJadwalKelompok from "@/pages/components/card/CardTambahJadwalKelompok";
import React, { FC } from "react";
import { IoIosAdd } from "react-icons/io";


interface JadwalProps {}

const Jadwal: FC<JadwalProps> = ({}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <CardTambahJadwalKelompok />
        <CardTambahJadwalKelompok />
        <CardTambahJadwalKelompok />
      </div>
      <div className="w-full h-[1px] bg-Neutral-70"></div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="font-semibold text-lg text-Primary-20">
            Jadwal Tanpa Kelompok
          </p>
          <Search />
          <Button
          type="button"
          brColor="border-Tertiary-50"
          textColor="text-Tertiary-50"
          bgColor="bg-Tertiary-50"
          label="Tambah"
          icon={IoIosAdd}
        //   onClick={onClick}
          outlined
        />
        </div>
        <div className=" h-72 overflow-auto scrollbar pr-2 ">
          <div className="grid grid-cols-3 gap-4 ">
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
            <CardTambahJadwalKelompok />
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

export default Jadwal;
