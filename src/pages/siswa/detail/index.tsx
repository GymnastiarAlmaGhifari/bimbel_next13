import Image from "next/image";
import React, { FC } from "react";
import { IoMdCloudUpload } from "react-icons/io";

interface DetailSiswaProps {
  nama: string;
  email: string;
  nomor_telepon: string;
  alamat: string;
  sekolah: string;
  hp_ortu: string;
  image?: string;
  kelompok: string;
  kelas: string;
}

const DetailSiswa: FC<DetailSiswaProps> = ({
  alamat,
  email,
  hp_ortu,
  kelas,
  kelompok,
  nama,
  nomor_telepon,
  sekolah,
  image,
}) => {
  return (
    <div className="flex gap-10">
      <div className="flex flex-col gap-6 w-[400px] bg-red-500 rounded-lg">
        <Image
          src={"/img/user/default.png"}
          alt="Gambar"
          width={200}
          height={200}
          className="rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3  className="font-bold">Agimul Karim</h3>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Email</h3>
          <span className="font-bold text-Primary-10">email@gmail.com</span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">No. Telp</h3>
          <span className="font-bold text-Primary-10">085123456789</span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Alamat</h3>
          <span className="font-bold text-Primary-10">
            Kecmatan Wakanda - Kabupaten Honda
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Sekolah</h3>
          <span className="font-bold text-Primary-10">SMP Negeri Leluhur</span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Alamat</h3>
          <span className="font-bold text-Primary-10">
            Kecmatan Wakanda - Kabupaten Honda
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Kelompok</h3>
          <span className="font-bold text-Primary-10">Regular</span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Kelas</h3>
          <span className="font-bold text-Primary-10">hzhzh</span>
        </div>
      </div>
    </div>
  );
};

export default DetailSiswa;
