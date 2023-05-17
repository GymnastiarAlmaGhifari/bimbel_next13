import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/Modal";
import MapelEdit from "./edit";
import CardMapel from "@/pages/components/card/CardMapel";
import HeadTable from "@/pages/components/HeadTable";
import CreateMapel from "./create";

interface Mapel {
  kelas: any;
  id: string;
  nama_mapel: string;
  nama_kelas: string;
  createdAt: Date;
  updatedAt: Date;
}

const Mapel: FC<Mapel> = () => {
  const { data: mapel, error } = useSWR<Mapel[]>("/api/mapel", fetcher, {});

  const [selectedMapel, setSelectedMapel] = useState<Mapel | null>(null);

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

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const onClose = () => {
    setSelectedMapel(null);
  };



  if (error) {
    return <p>Error loading mapel.</p>;
  }

  return (
    <div className="h-full p-10 bg-Neutral-95">
      <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg">
        <HeadTable label="Mata Pelajaran" onClick={
          () => setShowCreate(true)
        } />
        <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">

          {mapel ? (
            <>
              {mapel.length === 0 ? (
                <p>No mapel found.</p>
              ) : (
                mapel.map((item) => (
                  <CardMapel
                    key={item.id}
                    nama_kelas={item.kelas?.nama_kelas} nama_mapel={item.nama_mapel}
                    onClick={() => setSelectedMapel(item)}
                  />
                ))
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
          <Link href="/pengaturan">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              kembali
            </button>
          </Link>
          {selectedMapel && (
            <ModalDetail
              titleModal="Edit Mapel"
              onOpen={true}
              onClose={onClose}
            >
              <MapelEdit
                data={selectedMapel}
                onClose={onClose}
                mapelId={selectedMapel.id}
              />
            </ModalDetail>
          )}
          {/* buat modal dari getname  */}
          {showSuccess && (
            <ModalDetail
              titleModal="SUCSSES"
              onOpen={true}
              onClose={() => setShowSuccess(false)}
            >
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-green-500">Berhasil</h1>
                <p className="text-sm text-gray-500">
                  {selectedMapel?.nama_mapel}Data berhasil diubah
                </p>
              </div>
            </ModalDetail>
          )}

          {/* modal create */}
          {showCreate && (
            <ModalDetail
              titleModal="Tambah Mapel"
              onOpen={true}
              onClose={() => setShowCreate(false)}
            >
              <CreateMapel
                onClose={() => setShowCreate(false)}
                onSucsess={() => {
                  setShowSuccess(true);
                }}

              />
            </ModalDetail>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mapel;
