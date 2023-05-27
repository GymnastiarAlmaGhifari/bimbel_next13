import HeadTable from "@/pages/components/HeadTable";
import Navbar from "@/pages/components/Navbar";
import Sidebar from "@/pages/components/Sidebar";
import CardPembayaran from "@/pages/components/card/CardPembayaranTagihan";
import React, { FC, useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/modal/Modal";
import LihatNota from "../modal/nota";

interface RiwayatPembayaran {
  id: string;
  nama_rekening: string;
  nomor_rekening: string;
  jumlah_tagihan: number;
  tanggal_tagihan: string;
  tanggal_jatuh_tempo: string;
  tanggal_bayar: string;
  tanggal_approve: string;
  Bulan: string;
  Tahun: number;
  status: string;
  nota: string;
  user: {
    name: string
  }
  siswa: {
    nama: string
    image: string
  }
}

const RiwayatPembayaran: FC<RiwayatPembayaran> = () => {

  const { data: riwayat, error } = useSWR('/api/tagihan/riwayat', fetcher)

  const [showNota, setShowNota] = useState<RiwayatPembayaran | null>(null);


  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable label="Riwayat Pembayaran" noAdd />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
              {riwayat ? (
                <>
                  {riwayat.length === 0 ? (
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-2xl font-bold text-Neutral-600">Data Kosong</p>
                      <p className="text-Neutral-500">PP</p>
                    </div>
                  ) : (
                    <>
                      {riwayat.map((riwayat: RiwayatPembayaran) => (
                        <CardPembayaran
                          key={riwayat.id}
                          bulan={riwayat.Bulan}
                          jumlah_tagihan={riwayat?.jumlah_tagihan}
                          nama_rekening={riwayat?.nama_rekening}
                          nama_siswa={riwayat?.siswa?.nama}
                          nama_user={riwayat?.user?.name}
                          nomor_rekening={riwayat?.nomor_rekening}
                          nota={riwayat?.nota}
                          status={riwayat?.status}
                          tanggal_approve={riwayat?.tanggal_approve}
                          tanggal_bayar={riwayat?.tanggal_bayar}
                          tanggal_jatuh_tempo={riwayat?.tanggal_jatuh_tempo}
                          tanggal_tagihan={riwayat?.tanggal_tagihan}
                          gambar={riwayat?.siswa.image}
                          tahun={riwayat?.Tahun}
                          onClick={() =>
                            setShowNota(riwayat)
                          }
                        />
                      ))}
                    </>
                  )}
                </>
              ) : (
                <>
                  {error ? (
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-2xl font-bold text-Neutral-600">Data Kosong</p>
                      <p className="text-Neutral-500">Silahkan tambahkan data siswa</p>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-2xl font-bold text-Neutral-600">Loading...</p>
                    </div>
                  )
                  }
                </>
              )
              }
            </div>
          </div>
        </div>
      </div>
      {
        showNota && (
          <ModalDetail
            titleModal="Detail Tagihan"
            onClose={() => setShowNota(null)}
          >
            <LihatNota
              data={showNota}
              onClose={() => setShowNota(null)}
            />
          </ModalDetail>
        )
      }
    </div>
  );
};

export default RiwayatPembayaran;
