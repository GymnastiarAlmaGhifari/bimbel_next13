import React, { FC, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeadTable from "../components/HeadTable";
import CardSiswa from "../components/card/CardSiswa";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/Modal";
import { useSession } from "next-auth/react";


interface Siswa {
  id: string;
  nama: string;
  email: string;
  nomor_telepon: string;
  alamat: string;
  sekolah: string;
  hp_ortu: string;
  image: string;
  program: any;
  program_id: string;
  tipe: string;
  level: string;
  kelas: any;
  kelas_id: string;
  nama_kelas: string;
}

const Siswa: FC<Siswa> = () => {
  const { data: session, status } = useSession();

  const { data: siswa, error } = useSWR<Siswa[]>("/api/siswa", fetcher, {});

  // selectedit dan select delete

  const [selectedEdit, setSelectedDelete] = useState<Siswa | null>(null);

  const [selectedDelete, setSelectedEdit] = useState<Siswa | null>(null);

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

  const backSiswa = () => {
    setSelectedEdit(null);
    setSelectedDelete(null);
  };



  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-10 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable label="Siswa" />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">

              {
                siswa ? (
                  <>
                    {siswa.length === 0 ? (
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-2xl font-bold text-Neutral-600">Data Kosong</p>
                        <p className="text-Neutral-500">Silahkan tambahkan data siswa</p>
                      </div>
                    ) : (
                      <>
                        {siswa.map((siswa) => (
                          <CardSiswa
                            key={siswa.id}
                            tipe={siswa.tipe}
                            kelas={siswa.kelas.nama_kelas}
                            kelompok={siswa.level}
                            nama_siswa={siswa.nama}
                            status="Aktif"
                            onEdit={() => setSelectedEdit(siswa)}
                            onDelete={() => setSelectedDelete(siswa)}
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
  );
};

export default Siswa;
