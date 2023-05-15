import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { GetServerSideProps } from "next";
import { ModalDetail } from "@/pages/components/Modal";
import RuangEdit from "./edit";
import HeadTable from "@/pages/components/HeadTable";
import CardRuang from "@/pages/components/card/CardRuang";

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
        <HeadTable label="Ruang" />
        <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
          <CardRuang nama_ruang="Utama" tipe_ruang="Kelas" />
          {ruang ? (
            <>
              {ruang.length === 0 ? (
                <p>No ruang found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama Ruang</th>
                      <th>Tipe Ruang</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ruang.map((ruang) => (
                      <tr key={ruang.id}>
                        <td>{ruang.id}</td>
                        <td>{ruang.nama}</td>
                        <td>{ruang.tipe}</td>
                        <td>{ruang.createdAt.toString()}</td>
                        <td>{ruang.updatedAt.toString()}</td>
                        <td>
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setSelectedRuang(ruang)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              onOpen={true}
              onClose={onClose}
            >
              <RuangEdit
                data={selectedRuang}
                onClose={onClose}
                ruangId={selectedRuang.id}
              />
            </ModalDetail>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ruang;
