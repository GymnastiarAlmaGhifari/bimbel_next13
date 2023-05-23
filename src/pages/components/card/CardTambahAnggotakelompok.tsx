import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { HiOutlineCheck } from "react-icons/hi";

type CardTambahAnggotaKelompokProps = {
  type?: string;
  id?: string;
  value?: string;
  register?: any;
  label?: string;
  nomor_telepon?: string;
  getValues?: any; // Tambahkan properti getValues
  setValue?: any; //
  groupName?: string;

};

const CardTambahAnggotaKelompok: FC<CardTambahAnggotaKelompokProps> = ({
  type,
  id,
  value,
  register,
  label,
  nomor_telepon,
  getValues,
  setValue,
  groupName,

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
        } else if (groupName === 'siswaTanpaKelompok') {
          // Checkbox pada siswa tanpa kelompok dicentang, tambahkan nilai baru ke dalam array checkboxes2
          setValue('checkboxes2', [...checkboxes2, id]);
        }
      } else {
        if (groupName === 'kelompok') {
          // Checkbox pada anggota kelompok tidak dicentang, hapus nilai dari array checkboxes
          setValue('checkboxes', checkboxes.filter((item: any) => item !== value));
        } else if (groupName === 'siswaTanpaKelompok') {
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
            type={type}
            id={id}
            className="appearance-none"
            value={value}
            {...register}
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
        <div className="w-16 h-16 rounded-fsull overflow-clip scale-100 bg-red-400">
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
          <p className="font-bold text-center">{label}</p>
          <p className="text-sm text-center">{nomor_telepon}</p>
        </div>
      </div>
    </div>
  );
};

export default CardTambahAnggotaKelompok;
