import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/modal/Modal";
import RuangEdit from "./edit";
import HeadTable from "@/pages/components/HeadTable";
import CardRuang from "@/pages/components/card/CardRuang";
import Create from "./create";

interface Ruang {
  id: string;
  nama: string;
  tipe: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  ruang: Ruang[];
}

const Ruang: FC<Props> = () => {
  const { data: ruang, error } = useSWR<Ruang[]>("/api/ruang", fetcher, {});

  const [selectedRuang, setSelectedRuang] = useState<Ruang | null>(null);

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
    setSelectedRuang(null);
  };

  if (error) {
    return <p>Error loading ruang.</p>;
  }

  return (
    <div className="h-full p-10 bg-Neutral-95">
      <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg">
        <HeadTable
          label="Ruang"
          onClick={() => {
            setShowCreate(true);
          }}
        />
        <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
          {ruang ? (
            <>
              {ruang.length === 0 ? (
                <p>No ruang found.</p>
              ) : (
                ruang.map((ruang) => (
                  <CardRuang
                    key={ruang.id}
                    nama_ruang={ruang.nama}
                    tipe_ruang={ruang.tipe}
                    onClick={() => {
                      setSelectedRuang(ruang);
                    }}
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
          {selectedRuang && (
            <ModalDetail
              titleModal="Edit Ruang"
              onClose={onClose}
            >
              <RuangEdit
                data={selectedRuang}
                onClose={onClose}
                ruangId={selectedRuang.id}
              />
            </ModalDetail>
          )}
          {showSuccess && (
            <ModalDetail
              titleModal="Modal Ruang"
              onClose={() => setShowSuccess(false)}
            >
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-green-500">Berhasil</h1>
                <p className="text-sm text-gray-500">
                  {selectedRuang?.nama} berhasil diupdate
                </p>
              </div>
            </ModalDetail>
          )}

          {/* modal create */}
          {showCreate && (
            <ModalDetail
              titleModal="Tambah Ruang"
              onClose={() => setShowCreate(false)}
            >
              <Create
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

export default Ruang;
