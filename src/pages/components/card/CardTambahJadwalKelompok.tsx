import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { HiOutlineCheck } from "react-icons/hi";

type CardTambahJadwalKelompokProps = {
  type?: string;
  id?: string;
  value?: string;
  register?: any;
  getValues?: any; // Tambahkan properti getValues
  setValue?: any; //
  groupName?: string;
  hari?: string;
  sesi?: string;
  ruang?: string;
  mata_pelajaran?: string;
};

const CardTambahJadwalKelompok: FC<CardTambahJadwalKelompokProps> = ({
  type,
  id,
  value,
  register,
  getValues,
  setValue,
  groupName,
  hari,
  sesi,
  ruang,
  mata_pelajaran,
}) => {
  // handle check sesuai dengan value yang diinputkan jika true maka akan menampilkan icon check
  const [check, setCheck] = useState(false);

  useEffect(() => {
    if (getValues) {
      const checkboxes = getValues('checkboxes') || [];
      const checkboxes2 = getValues('checkboxes2') || [];

      if (value) {
        // Checkbox pada anggota kelompok dicentang, tambahkan nilai baru ke dalam array checkboxes
        if (checkboxes.includes(value)) {
          setCheck(true);
        }
      } else {
        // Checkbox pada siswa tanpa kelompok dicentang, tambahkan nilai baru ke dalam array checkboxes2
        if (checkboxes2.includes(id)) {
          setCheck(true);
        }
      }
    }
  }, [getValues, value, id]);

  const handleCheck = () => {
    setCheck(!check);

    if (getValues && setValue) {
      const checkboxes = getValues('checkboxes') || [];
      const checkboxes2 = getValues('checkboxes2') || [];

      if (!check) {
        if (groupName === 'kelompok') {
          // Checkbox pada anggota kelompok dicentang, tambahkan nilai baru ke dalam array checkboxes
          setValue('checkboxes', [...checkboxes, value]);
        } else if (groupName === 'jadwalTanpaKelompok') {
          // Checkbox pada siswa tanpa kelompok dicentang, tambahkan nilai baru ke dalam array checkboxes2
          setValue('checkboxes2', [...checkboxes2, id]);
        }
      } else {
        if (groupName === 'kelompok') {
          // Checkbox pada anggota kelompok tidak dicentang, hapus nilai dari array checkboxes
          setValue('checkboxes', checkboxes.filter((item: any) => item !== value));
        } else if (groupName === 'jadwalTanpaKelompok') {
          // Checkbox pada siswa tanpa kelompok tidak dicentang, hapus nilai dari array checkboxes2
          setValue('checkboxes2', checkboxes2.filter((item: any) => item !== id));
        }
      }
    }
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
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm text-Neutral-70">Hari</h3>
            <span className="font-bold">{hari}</span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <h3 className="text-sm text-Neutral-70">Sesi</h3>
            <span className="font-bold">{sesi}</span>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm text-Neutral-70">Ruang</h3>
            <span className="font-bold">{ruang}</span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <h3 className="text-sm text-Neutral-70">Mata Pelajaran</h3>
            <span className="font-bold">{mata_pelajaran}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTambahJadwalKelompok;
