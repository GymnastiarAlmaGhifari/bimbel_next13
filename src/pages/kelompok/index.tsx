import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import React, { FC, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeadTable from "../components/HeadTable";
import CardKelompok from "../components/card/CardKelompok";
import { ModalDetail } from "../components/modal/Modal";
import KelompokEdit from "./edit";
import CreateKelompok from "./create";
import Anggota from "./anggota";
import Jadwal from "./jadwal";
import TambahJadwal from "./jadwal";
import DetailSiswa from "../siswa/detail";

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
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  const { data: kelompoks, error } = useSWR<Kelompok[]>(
    "/api/kelompok",
    fetcher,
    {}
  );

  let filteredKelompok = kelompoks;

  if (debouncedValue) {
    filteredKelompok = kelompoks?.filter((kelompok) =>
      kelompok.nama_kelompok
        .toLowerCase()
        .includes(debouncedValue.toLowerCase())
    );
  }

  const [selected, setSelected] = useState<Kelompok | null>(null);

  const [selectedAnggota, setSelectedAnggota] = useState<Kelompok | null>(null);
  const [selectedJadwal, setSelectedJadwal] = useState<Kelompok | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<Kelompok | null>(null);

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

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable
              filterKelompok
              label="Kelompok"
              onClick={() => {
                setShowCreate(true);
              }}
              onChange={handleInputChange}
            />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scollbar scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg ">
              {filteredKelompok ? (
                <>
                  {filteredKelompok.length === 0 ? (
                    <p>No program found.</p>
                  ) : (
                    filteredKelompok.map((kelompok) => (
                      <CardKelompok
                        key={kelompok.id}
                        nama_kelompok={kelompok.nama_kelompok}
                        level={kelompok.level}
                        tipe={kelompok.tipe}
                        onClick={() => {
                          setSelected(kelompok);
                        }}
                        id={kelompok.id}
                        addAnggota={() => {
                          setSelectedAnggota(kelompok);
                        }}
                        addJadwal={() => {
                          setSelectedJadwal(kelompok);
                        }}
                        onDetail={() => setSelectedDetail(kelompok)}
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
        <ModalDetail titleModal="Edit Kelompok" onClose={backKelompok}>
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

      {/* modal create */}
      {showCreate && (
        <ModalDetail
          titleModal="Tambah Pengguna"
          onClose={() => setShowCreate(false)}
        >
          <CreateKelompok
            onClose={() => setShowCreate(false)}
            onSucsess={() => {
              setShowSuccess(true);
            }}
          />
        </ModalDetail>
      )}

      {/* modal add anggota */}
      {selectedAnggota && (
        <ModalDetail
          wAuto
          titleModal={`Tambah Anggota ${selectedAnggota.nama_kelompok}`}
          onClose={() => setSelectedAnggota(null)}
        >
          <Anggota
            onClose={() => setSelectedAnggota(null)}
            onSuccess={() => {
              setShowSuccess(true);
            }}
            data={selectedAnggota}
            kelompokId={selectedAnggota.id}
          />
        </ModalDetail>
      )}

      {/* Modal add jadwal */}
      {selectedJadwal && (
        <ModalDetail
          titleModal={`Tambah Jadwdal ${selectedJadwal.nama_kelompok}`}
          onClose={() => setSelectedJadwal(null)}
        >
          <TambahJadwal
            onClose={() => setSelectedJadwal(null)}
            onSucsess={() => {
              setShowSuccess(true);
            }}
            data={selectedJadwal}
            kelompokId={selectedJadwal.id}
          />
        </ModalDetail>
      )}

      {selectedDetail && (
        <ModalDetail
          titleModal="Detail Siswa"
          onClose={() => setSelectedDetail(null)}
        >
          <DetailSiswa
            alamat=""
            email=""
            hp_ortu=""
            kelas=""
            kelompok=""
            nama=""
            nomor_telepon=""
            sekolah=""
          />
        </ModalDetail>
      )}
    </div>
  );
};

export default Kelompok;
