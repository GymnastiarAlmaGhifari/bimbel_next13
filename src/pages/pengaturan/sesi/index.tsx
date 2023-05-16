import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/Modal";
import SesiEdit from "./edit";
import CardSesi from "@/pages/components/card/CardSesi";
import HeadTable from "@/pages/components/HeadTable";

interface Sesi {
  id: string;
  nama_sesi: string;
  jam_mulai: string;
  jam_selesai: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  sesi: Sesi[];
}

const Sesi: FC<Props> = () => {
  const { data: sesi, error } = useSWR<Sesi[]>("/api/sesi", fetcher, {});

  const [selectedSesi, setSelectedSesi] = useState<Sesi | null>(null);

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const onClose = () => {
    setSelectedSesi(null);
  };

  if (error) {
    return <p>Error loading sesi.</p>;
  }

  return (
    <div className="h-full p-10 bg-Neutral-95">
      <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg">
        <HeadTable label="Sesi" />
        <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
          <CardSesi nama_sesi="1" mulai_sesi="19:00" selesai_sesi="21:00" />
          {sesi ? (
            <>
              {sesi.length === 0 ? (
                <p>No sesi found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama Sesi</th>
                      <th>Mulai Sesi</th>
                      <th>Selesai Sesi</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sesi.map((sesi) => (
                      <tr key={sesi.id}>
                        <td>{sesi.id}</td>
                        <td>{sesi.nama_sesi}</td>
                        <td>{sesi.jam_mulai}</td>
                        <td>{sesi.jam_selesai}</td>
                        <td>{sesi.createdAt.toString()}</td>
                        <td>{sesi.updatedAt.toString()}</td>
                        <td>
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setSelectedSesi(sesi)}
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

          {selectedSesi && (
            <ModalDetail titleModal="Edit Sesi" onOpen={true} onClose={onClose}>
              <SesiEdit
                data={selectedSesi}
                onClose={onClose}
                sesiId={selectedSesi.id}
              />
            </ModalDetail>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sesi;
