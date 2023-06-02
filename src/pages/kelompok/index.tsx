import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import React, { FC, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeadTable from "../components/HeadTable";
import CardKelompok from "../components/card/CardKelompok";
import { ModalDetail, ModalSucces } from "../components/modal/Modal";
import KelompokEdit from "./edit";
import CreateKelompok from "./create";
import Anggota from "./anggota";
import Jadwal from "./jadwal";
import TambahJadwal from "./jadwal";
import DetailSiswa from "../siswa/detail";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Button from "../components/buttons/Button";

interface Kelompok {
  program: any;
  jadwal: any;
  id: string;
  nama_kelompok: string;
  jadwal_id: string;
  program_id: string;
  jumlah_siswa: number;
  jumlah_jadwal: number;
  tipe: string;
  level: string;
  createdAt: Date;
  updatedAt: Date;
}

const Kelompok: FC<Kelompok> = () => {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  const { data: session, status } = useSession();
  const router = useRouter();

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

  let filteredKelompok: Kelompok[] | undefined = kelompoks;

  if (debouncedValue && filteredKelompok) {
    filteredKelompok = filteredKelompok?.filter((kelompok) =>
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

  const PAGE_SIZE = 10;
  const MAX_PAGE_DISPLAY = 5; // Jumlah maksimal nomor halaman yang ditampilkan

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  let paginatedKelompok: Kelompok[] | undefined = [];
  let totalPages: number = 0;
  let pageNumbers: number[] = [];
  if (filteredKelompok) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    paginatedKelompok = filteredKelompok.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredKelompok.length / PAGE_SIZE);

    const startPage = Math.max(
      currentPage - Math.floor(MAX_PAGE_DISPLAY / 2),
      1
    );
    const endPage = Math.min(startPage + MAX_PAGE_DISPLAY - 1, totalPages);

    pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            {
              session?.user.role === "TENTOR"
                ? (
                  <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
                    <h1 className="text-2xl font-bold text-gray-500">
                      Hanya Super Admin dan Admin yang bisa mengakses halaman ini
                    </h1>
                    {/* back to dashboard */}
                    <Button
                      type="button"
                      withBgColor
                      bgColor="bg-Primary-40"
                      brColor=""
                      label="Kembali"
                      icon={IoIosArrowBack}
                      textColor="text-Primary-95"
                      onClick={() => router.push("/dashboard")}
                    />
                  </div>
                ) : (
                  <>
                    <HeadTable
                      label="Kelompok"
                      onClick={() => {
                        setShowCreate(true);
                      }}
                      onChange={handleInputChange}
                    />
                    <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scollbar scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg ">
                      {paginatedKelompok ? (
                        <>
                          {paginatedKelompok.length === 0 ? (
                            <p>No program found.</p>
                          ) : (
                            paginatedKelompok.map((kelompok) => (
                              <CardKelompok
                                key={kelompok.id}
                                nama_kelompok={kelompok.nama_kelompok}
                                level={kelompok.program.level}
                                tipe={kelompok.program.tipe}
                                nama_program={kelompok.program.nama_program}
                                jumlah_siswa={kelompok.jumlah_siswa}
                                jumlah_jadwal={kelompok.jumlah_jadwal}
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
                    <div className="flex justify-center gap-4">
                      {totalPages > 1 && (
                        <div className="flex justify-center gap-4">
                          {!isFirstPage && (
                            <button
                              className="bg-Neutral-95 text-Primary-40 font-semibold py-2 px-3 rounded-full hover:bg-Primary-40 hover:text-Primary-95"
                              onClick={() => handlePageChange(currentPage - 1)}
                            >
                              <IoIosArrowBack size={16} />
                            </button>
                          )}
                          <div className="flex gap-2">
                            {pageNumbers.map((page) => (
                              <button
                                key={page}
                                className={`px-4 py-2 rounded-full font-semibold ${currentPage === page
                                  ? "bg-Primary-40 text-Neutral-100"
                                  : "text-Primary-40 hover:bg-Primary-95 hover:text-Primary-30"
                                  }`}
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            ))}
                          </div>
                          {!isLastPage && (
                            <button
                              className="bg-Neutral-95 text-Primary-40 font-semibold py-1 px-3 rounded-full hover:bg-Primary-40 hover:text-Primary-95"
                              onClick={() => handlePageChange(currentPage + 1)}
                            >
                              <IoIosArrowForward size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )
            }
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
        <ModalSucces label="" onClose={() => setShowSuccess(false)}>
          {/* <div className="flex flex-col items-center justify-center">
            <h1 className=" font-bold text-green-500">Berhasil</h1>
            <p className="text-sm text-gray-500">
              {selected?.name}Data berhasil diubah
            </p>
          </div> */}
        </ModalSucces>
      )}
      {/* modal create */}
      {showCreate && (
        <ModalDetail
          titleModal="Tambah Kelompok"
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
    </div>
  );
};

export default Kelompok;
