import React, { FC, useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/modal/Modal";
import { useSession } from "next-auth/react";
import CardSiswa from "@/pages/components/card/CardSiswa";
import Sidebar from "@/pages/components/Sidebar";
import Navbar from "@/pages/components/Navbar";
import HeadTable from "@/pages/components/HeadTable";
import { useRouter } from "next/router";

interface Siswa {
  id: string;
  nama_kelompok: string;
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
  kelompok: any;
  kelompok_id: string;
  anggota: any;

}

const DetailAnggota: FC<Siswa> = () => {
  //   const { data: session, status } = useSession();

  const router = useRouter();
  const { id } = router.query;

  const { data: siswa, error } = useSWR(`/api/kelompok/siswa/${id}`, fetcher, {});

  //   // selectedit dan select delete

  //   const [selectedEdit, setSelectedEdit] = useState<Siswa | null>(null);

  //   const [selectedDelete, setSelectedDelete] = useState<Siswa | null>(null);

  //   const [showCreate, setShowCreate] = useState(false);
  //   const [showSuccess, setShowSuccess] = useState(false);

  //   useEffect(() => {
  //     const timeoutId = setTimeout(() => {
  //       setShowSuccess(false);
  //     }, 1000);

  //     return () => {
  //       clearTimeout(timeoutId);
  //     };
  //   }, [showSuccess]);

  //   const backSiswa = () => {
  //     setSelectedEdit(null);
  //     setSelectedDelete(null);
  //   };

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <h1 className="text-2xl text-Neutral-900 font-bold px-4">{siswa?.nama_kelompok}</h1>
            <HeadTable label="Anggota Kelompok" />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
              {
                siswa ? (
                  <>
                    {siswa.anggota.length === 0 ? (
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-2xl font-bold text-Neutral-600">Data Kosong</p>
                        <p className="text-Neutral-500">Silahkan tambahkan data siswa</p>
                      </div>
                    ) : (
                      <>
                        {siswa.anggota.map((siswa: any) => (
                          <CardSiswa
                            key={siswa.id}
                            tipe="{siswa.program.tipe}"
                            kelas="{siswa.program.kelas.nama_kelas}"
                            level="{siswa.program.level}"
                            nama_siswa={siswa.nama}
                            nama_kelompok={siswa.nama_kelompok}
                            hp={siswa.nomor_telepon}
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

export default DetailAnggota;
