import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/modal/Modal";
import ProgramEdit from "./edit";
import HeadTable from "@/pages/components/HeadTable";
import CardProgram from "@/pages/components/card/CardProgram";
import CreateProgram from "./create";

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
    setSelectedProgram(null);
  };

  if (error) {
    return <p>Error loading program.</p>;
  }

  return (
    <div className="h-full p-10 bg-Neutral-95">
      <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg">
        <HeadTable label="Program" onClick={() => setShowCreate(true)} />
        <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
          {program ? (
            <>
              {program.length === 0 ? (
                <p>No program found.</p>
              ) : (
                program.map((item) => (
                  <CardProgram
                    key={item.id}
                    nama_program={item.nama_program}
                    tipe={item.tipe}
                    level={item.level}
                    kelas={item.kelas.nama_kelas}
                    onEdit={() => setSelectedProgram(item)}
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

          {selectedProgram && (
            <ModalDetail
              titleModal="Edit Program"
              onClose={onClose}
            >
              <ProgramEdit
                data={selectedProgram}
                onClose={onClose}
                programId={selectedProgram.id}
              />
            </ModalDetail>
          )}
          {showSuccess && (
            <ModalDetail
              titleModal="SUCSSES"
              onClose={() => setShowSuccess(false)}
            >
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-green-500">Berhasil</h1>
                <p className="text-sm text-gray-500">
                  {selectedProgram?.nama_program}Data berhasil diubah
                </p>
              </div>
            </ModalDetail>
          )}

          {/* modal create */}
          {showCreate && (
            <ModalDetail
              titleModal="Tambah Program"
              onClose={() => setShowCreate(false)}
            >
              <CreateProgram
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
export default Program;
