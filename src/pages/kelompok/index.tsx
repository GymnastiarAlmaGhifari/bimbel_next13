import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import React, { FC, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeadTable from "../components/HeadTable";
import CardKelompok from "../components/card/CardKelompok";
import { ModalDetail } from "../components/Modal";
import KelompokEdit from "./edit";

interface Kelompok {
  program: any;
  jadwal: any;
  id: string;
  nama_kelompok: string;
  jadwal_id: string;
  program_id: string;
  tipe: string;
  level: string;
  createdAt: Date;
  updatedAt: Date;
}

const Kelompok: FC<Kelompok> = () => {
  const { data: kelompoks, error } = useSWR<Kelompok[]>(
    "/api/kelompok",
    fetcher,
    {}
  );
  const [selected, setSelected] = useState<Kelompok | null>(null);

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const backKelompok = () => {
    setSelected(null);
  };

  // open modal create
  const [showCreate, setShowCreate] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccess(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccess]);

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="h-full p-10 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable label="Kelompok" />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
              {kelompoks ? (
                <>
                  {kelompoks.length === 0 ? (
                    <p>No program found.</p>
                  ) : (
                    kelompoks.map((kelompok) => (
                      <CardKelompok
                        key={kelompok.id}
                        nama_kelompok={kelompok.nama_kelompok}
                        level={kelompok.program.level}
                        tipe={kelompok.program.tipe}
                        onClick={() => {
                          setSelected(kelompok);
                        }}
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
      {selected && (
        <ModalDetail
          titleModal="Edit Kelompok"
          onOpen={true}
          onClose={backKelompok}
        >
          <KelompokEdit
            kelompokId={selected.id}
            onClose={backKelompok}
            onSucsess={() => {
              setShowSuccess(true);
            }}
            data={selected}
          />
        </ModalDetail>
      )}

      {/* buat modal dari getname  */}
      {showSuccess && (
        <ModalDetail
          titleModal="Edit Kelompok"
          onOpen={true}
          onClose={() => setShowSuccess(false)}
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-green-500">Berhasil</h1>
            <p className="text-sm text-gray-500">
              {selected?.nama_kelompok}Data berhasil diubah
            </p>
          </div>
        </ModalDetail>
      )}
    </div>
  );
};

export default Kelompok;
