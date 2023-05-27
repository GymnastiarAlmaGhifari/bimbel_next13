import HeadTable from "@/pages/components/HeadTable";
import Navbar from "@/pages/components/Navbar";
import NavbarPembayaran from "@/pages/components/NavbarPembayaran";
import Sidebar from "@/pages/components/Sidebar";
import CardPembayaran from "@/pages/components/card/CardPembayaranTagihan";
import React, { FC, useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail, ModalSucces } from "@/pages/components/modal/Modal";
import LihatNota from "../modal/nota";
import Acc from "../modal/acc";
import Create from "../modal/create";

interface Pembayaran {
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

const Pembayaran: FC<Pembayaran> = () => {

  const { data: pembayaran, error } = useSWR('/api/tagihan', fetcher)

  // state shownota
  const [showNota, setShowNota] = useState<Pembayaran | null>(null);

  // create
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const [AcceptPembayaran, setAcceptPembayaran] = useState<Pembayaran | null>(null);

  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg overflow-auto">
            <NavbarPembayaran />
            <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
              <HeadTable
                bulanPembayaran
                tahunPembayaran
                label="Tagihan"
                riwayat
                onClick={() => setShowCreate(true)}
              />
              <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
                {pembayaran ? (
                  <>
                    {pembayaran.length === 0 ? (
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-2xl font-bold text-Neutral-600">Data Kosong</p>
                        <p className="text-Neutral-500">PP</p>
                      </div>
                    ) : (
                      <>
                        {pembayaran.map((pembayaran: Pembayaran) => (
                          <CardPembayaran
                            key={pembayaran.id}
                            bulan={pembayaran.Bulan}
                            jumlah_tagihan={pembayaran?.jumlah_tagihan}
                            nama_rekening={pembayaran?.nama_rekening}
                            nama_siswa={pembayaran?.siswa?.nama}
                            nama_user={pembayaran?.user?.name}
                            nomor_rekening={pembayaran?.nomor_rekening}
                            nota={pembayaran?.nota}
                            status={pembayaran?.status}
                            tanggal_approve={pembayaran?.tanggal_approve}
                            tanggal_bayar={pembayaran?.tanggal_bayar}
                            tanggal_jatuh_tempo={pembayaran?.tanggal_jatuh_tempo}
                            tanggal_tagihan={pembayaran?.tanggal_tagihan}
                            gambar={pembayaran?.siswa.image}
                            tahun={pembayaran?.Tahun}
                            onClick={() =>
                              setShowNota(pembayaran)
                            }
                            onAccept={() =>
                              setAcceptPembayaran(pembayaran)
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
      {
        AcceptPembayaran && (
          <ModalDetail
            titleModal="Detail Tagihan"
            onClose={() => setAcceptPembayaran(null)}
          >
            <Acc
              idAcc={AcceptPembayaran.id}
              data={AcceptPembayaran}
              onClose={() => setAcceptPembayaran(null)}
            // onSucsess={() => {
            //   setShowSuccess(true);
            // }}
            />
          </ModalDetail>
        )
      }
      {
        showCreate && (
          <ModalDetail
            titleModal="Tambah Tagihan"
            onClose={() => setShowCreate(false)}
          >
            <Create
            // onClose={() => setShowCreate(false)}
            />
          </ModalDetail>
        )
      }

    </div>
  );
};

export default Pembayaran;