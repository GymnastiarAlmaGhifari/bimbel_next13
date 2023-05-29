import Image from "next/image";
import { FC } from "react";
import ButtonEdit from "../buttons/ButtonEdit";
import Button from "../buttons/Button";
import { MdModeEdit } from "react-icons/md";
import Kelas from "@/pages/pengaturan/kelas";

interface CardPembayaranTagihanProps {
  nama_siswa?: string;
  nama_user?: string;
  nama_rekening?: string;
  nomor_rekening?: string;
  jumlah_tagihan?: number;
  tanggal_tagihan?: string;
  tanggal_jatuh_tempo?: string;
  tanggal_bayar?: string;
  tanggal_approve?: string;
  bulan?: string;
  tahun?: number;
  status?: string;
  nota?: string;
  gambar?: any;
  onClick?: () => void;
  onAccept?: () => void;
}

const CardPembayaranTagihan: FC<CardPembayaranTagihanProps> = ({
  onClick,
  nama_siswa,
  jumlah_tagihan,
  tanggal_tagihan,
  tanggal_jatuh_tempo,
  tanggal_bayar,
  tanggal_approve,
  bulan,
  status,
  nota,
  nama_rekening,
  nama_user,
  nomor_rekening,
  tahun,
  gambar,
  onAccept,
}) => {
  return (
    <div className="flex flex-col bg-Neutral-100 shadow-[0px_2px_8px_-4px_rgba(0,0,0,.3)] rounded-lg py-5 px-4 gap-3">
      <div className="flex justify-between">
        <div className="flex items-center h-max w-auto gap-3">
          <div className="h-14 w-14">
            <Image
              src={`/api/siswa/img?img=` + gambar ? `/api/siswa/img?img=` + gambar : "/img/user/default.png"}
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
              <h3 className="text-Neutral-30"> - {nota}</h3>
            </div>
            <h1 className=" text-Neutral-10 font-bold">user</h1>
            <div className="flex flex-col  gap-1">
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 justify-center">
          <h3 className="text-sm text-Neutral-30">pembayaran</h3>
          <div className="flex flex-row">
            <span className="font-bold text-Primary-10 flex-col">
              {tanggal_bayar ? tanggal_bayar : "Belum bayar"}
            </span>
          </div>
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
            {bulan} - {tahun}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <h3 className="text-sm text-Neutral-30">Tanggal Jatuh Tempo</h3>
          <span className="font-boldtext-Primary-10">{tanggal_jatuh_tempo}</span>
          <h2 className="font-semibold text-Error-40">{jumlah_tagihan}</h2>
        </div>
      </div>

      <div className="w-full h-[1px] bg-Neutral-30"></div>
      <div className="flex justify-between">
        <h2 className="font-semibold text-Error-40">{status}</h2>
        {
          // if nota not null show button lihat nota
          nota ? (
            <>
              <Button
                type="button"
                bgColor="bg-Tertiary-50"
                brColor=""
                label="Lihat Nota"
                textColor="text-Tertiary-50"
                icon={MdModeEdit}
                onClick={onClick}
              />
            </>
          ) : (
            ""
          )
        }

        {/* jika status tidak samadengan lunas */}
        {status != "LUNAS" ? (
          <Button
            type="button"
            bgColor="bg-Primary-10"
            brColor=""
            label="Terima Pembayaran"
            textColor="text-Primary-10"
            icon={MdModeEdit}
            onClick={onAccept}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CardPembayaranTagihan;
