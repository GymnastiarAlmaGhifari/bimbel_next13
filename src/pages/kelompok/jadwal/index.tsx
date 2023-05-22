import Search from "@/pages/components/Search";
import Button from "@/pages/components/buttons/Button";
import CardTambahJadwalKelompok from "@/pages/components/card/CardTambahJadwalKelompok";
import { ModalDetail } from "@/pages/components/modal/Modal";
import React, { FC, useState } from "react";
import { IoIosAdd } from "react-icons/io";


interface JadwalProps {
  onOpenModal?: () => void;
}

const Jadwal: FC<JadwalProps> = ({ }) => {

  const [onOpenModal, setOnOpenModal] = useState(false);

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
            onClick={
              () => {
                setOnOpenModal(true)
              }
            }
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
      {
        onOpenModal && (
          <ModalDetail
            titleModal="Tambah Jadwal"
            onClose={() => setOnOpenModal(false)}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <p className="font-semibold text-lg text-Primary-20">
                    Jadwal Tanpa Kelompok
                  </p>
                  <Button
                    type="button"
                    brColor="border-Tertiary-50"
                    textColor="text-Tertiary-50"
                    bgColor="bg-Tertiary-50"
                    label="Close Tambah"
                    onClick={
                      () => {
                        setOnOpenModal(false)
                      }
                    }
                  />
                </div>
              </div>
            </div>
          </ModalDetail>
        )
      }
    </div>
  );
};

export default Jadwal;
