import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/Modal";
import ProgramEdit from "./edit";
import HeadTable from "@/pages/components/HeadTable";
import CardProgram from "@/pages/components/card/CardProgram";

interface Program {
  kelas: any;
  id: string;
  nama_program: string;
  level: string;
  tipe: string;
  nama_kelas: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  program: Program[];
}

const Program: FC<Props> = () => {
  const { data: program, error } = useSWR<Program[]>(
    "/api/program",
    fetcher,
    {}
  );

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const onClose = () => {
    setSelectedProgram(null);
  };

  if (error) {
    return <p>Error loading program.</p>;
  }

  return (
    <div className="h-full p-10 bg-Neutral-95">
      <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg">
        <HeadTable label="Program" />
        <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
          <CardProgram kelas="SMK" level="Reguler" nama_program="Kelompok SD Reguler" tipe="Kelompok"/>
          {program ? (
            <>
              {program.length === 0 ? (
                <p>No program found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama Program</th>
                      <th>Level</th>
                      <th>Tipe</th>
                      <th>Kelas</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.nama_program}</td>
                        <td>{item.level}</td>
                        <td>{item.tipe}</td>
                        <td>{item.kelas.nama_kelas}</td>
                        <td>{item.createdAt.toString()}</td>
                        <td>{item.updatedAt.toString()}</td>
                        <td>
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setSelectedProgram(item)}
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

          {selectedProgram && (
            <ModalDetail
              titleModal="Edit Program"
              onOpen={true}
              onClose={onClose}
            >
              <ProgramEdit
                data={selectedProgram}
                onClose={onClose}
                programId={selectedProgram.id}
              />
            </ModalDetail>
          )}
        </div>
      </div>
    </div>
  );
};
export default Program;
