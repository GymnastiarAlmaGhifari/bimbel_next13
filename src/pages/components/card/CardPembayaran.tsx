import Image from "next/image";
import { FC } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";
import Kelas from "@/pages/pengaturan/kelas";

interface CardPembayaranprops {
  nama_siswa: string;
  jumlah_tagihan: string;
  tanggal_tagihan: string;
  kelas: string;
  tanggal_jatuh_tempo: string;
  tanggal_bayar: string;
  tanggal_approve: string;
  bulan: string;
  tahun: string;
  status: string;
  onClick?: () => void;
  tipe: string;
  gambar?: any;
}

const CardPembayaran: FC<CardPembayaranprops> = ({
  onClick,
  nama_siswa,
  jumlah_tagihan,
  tanggal_tagihan,
  tanggal_jatuh_tempo,
  tanggal_bayar,
  tanggal_approve,
  tipe,
  kelas,
  bulan,
  status,
  tahun,
  gambar,
}) => {
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
            <h1 className=" text-Neutral-10 font-bold">{nama_siswa}</h1>
            <div className="flex flex-col  gap-1">
              <h3 className="text-Neutral-30">{tipe}</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 justify-center">
          <h3 className="text-sm text-Neutral-30">Kelas</h3>
          <span className="font-bold text-Primary-10">{kelas}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Tanggal Batas Pembayaran</h3>
          <span className="font-bold text-Primary-10">{tanggal_tagihan}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-sm text-Neutral-30">Periode Bulan</h3>
          <span className="font-bold text-Primary-10">
            {bulan} {tahun}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <h3 className="text-sm text-Neutral-30">Tanggal Dibayar</h3>
          <span className="font-boldtext-Primary-10">{tanggal_bayar}</span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <div className="flex justify-between">
        <h2 className="font-semibold text-Error-40">{status}</h2>
        <h2 className="font-semibold text-Error-40">{jumlah_tagihan}</h2>
        {/* <Button
          type="button"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Edit Pengguna"
          textColor="text-Tertiary-50"
          icon={MdModeEdit}
          onClick={onClick}
        /> */}
      </div>
    </div>
  );
};

export default CardPembayaran;
