import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeadTable from "../components/HeadTable";
import CardSiswa from "../components/card/CardSiswa";
import CardKelompok from "../components/card/CardKelompok";
import CardModul from "../components/card/CardModul";
import { FC, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/modal/Modal";

interface ModulProps {
  id: string;
  nama_modul: string;
  url: string;
  thumbnail: string;
  updatedAt: string;
  mapel: {
    nama_mapel: string;
    kelas: {
      nama_kelas: string;
    }
  }
}

const Modul: FC<ModulProps> = () => {

  const { data: modul, error } = useSWR<ModulProps[]>("/api/modul", fetcher, {});

  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable label="Modul" />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">

              {modul ? (
                <>
                  {modul.length === 0 ? (
                    <p className="text-2xl text-Neutral-500 text-center">
                      Tidak ada modul
                    </p>
                  ) : (
                    modul.map((modul) => (
                      <CardModul
                        key={modul.id}
                        kelompok="Reguler"
                        mapel={modul.mapel.nama_mapel}
                        nama_modul={modul.nama_modul}
                        tanggal_upload={modul.updatedAt}
                        thumbnail={modul.thumbnail}
                        url={modul.url}
                        tingkatan={modul.mapel.kelas.nama_kelas}
                      />
                    ))
                  )}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modul;
