import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail, ModalHapus } from "@/pages/components/modal/Modal";
import KelasEdit from "./edit";
import CardKelas from "@/pages/components/card/CardKelas";
import HeadTable from "@/pages/components/HeadTable";
import CreateKelas from "./create";
import DeleteKelas from "./delete";
import Sidebar from "@/pages/components/Sidebar";
import Navbar from "@/pages/components/Navbar";
import NavbarPengaturan from "@/pages/components/NavbarPengaturan";

interface Kelas {
  id: string;
  nama_kelas: string;
  createdAt: Date;
  updatedAt: Date;
}

const Kelas: FC<Kelas> = () => {
  const { data: kelas, error } = useSWR<Kelas[]>("/api/kelas", fetcher, {});

  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);

  // delete selected
  const [showDelete, setShowDelete] = useState<Kelas | null>(null);

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

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const onClose = () => {
    setSelectedKelas(null);
  };

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />

      <div className="w-full flex flex-col">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg overflow-auto">
            <NavbarPengaturan />
            <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
              <HeadTable label="Kelas" onClick={() => setShowCreate(true)} />
              <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
                {kelas ? (
                  <>
                    {kelas.length === 0 ? (
                      <p>No kelas found.</p>
                    ) : (
                      kelas.map((kelas) => (
                        <CardKelas
                          key={kelas.id}
                          nama_kelas={kelas.nama_kelas}
                          onEdit={() => setSelectedKelas(kelas)}
                          onDelete={() => setShowDelete(kelas)}
                        />
                      ))
                    )}
                  </>
                ) : (
                  <p>Loading...</p>
                )}

                {selectedKelas && (
                  <ModalDetail titleModal="Edit Kelas" onClose={onClose}>
                    <KelasEdit
                      kelasId={selectedKelas.id}
                      data={selectedKelas}
                      onClose={onClose}
                    />
                  </ModalDetail>
                )}
                {showSuccess && (
                  <ModalDetail
                    titleModal="Edit Kelompok"
                    onClose={() => setShowSuccess(false)}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-2xl font-bold text-green-500">
                        Berhasil
                      </h1>
                      <p className="text-sm text-gray-500">
                        {selectedKelas?.nama_kelas}Data berhasil diubah
                      </p>
                    </div>
                  </ModalDetail>
                )}

                {/* modal create */}
                {showCreate && (
                  <ModalDetail
                    titleModal="Tambah Pengguna"
                    onClose={() => setShowCreate(false)}
                  >
                    <CreateKelas
                      onClose={() => setShowCreate(false)}
                      onSucsess={() => {
                        setShowSuccess(true);
                      }}
                    />
                  </ModalDetail>
                )}
                {showDelete && (
                  <ModalHapus onClose={() => setShowDelete(null)}>
                    <DeleteKelas
                      data={showDelete}
                      onClose={() => setShowDelete(null)}
                      onSucsess={() => {
                        setShowSuccess(true);
                      }}
                      kelasId={showDelete.id}
                    />
                  </ModalHapus>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kelas;
