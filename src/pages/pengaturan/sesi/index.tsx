import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/modal/Modal";
import SesiEdit from "./edit";
import CardSesi from "@/pages/components/card/CardSesi";
import HeadTable from "@/pages/components/HeadTable";
import Sidebar from "@/pages/components/Sidebar";
import Navbar from "@/pages/components/Navbar";
import NavbarPengaturan from "@/pages/components/NavbarPengaturan";
import Create from "./create";
import DeleteSesi from "./delete";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface Sesi {
  id: string;
  nama_sesi: string;
  jam_mulai: string;
  jam_selesai: string;
  createdAt: Date;
  updatedAt: Date;
}

const Sesi: FC<Sesi> = () => {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  const { data: sesi, error } = useSWR<Sesi[]>("/api/sesi", fetcher, {});

  const [selectedSesi, setSelectedSesi] = useState<Sesi | null>(null);
  const [selectedSesiDelete, setSelectedSesiDelete] = useState<Sesi | null>(
    null
  );

  const [showCreate, setShowCreate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  let filteredSesi: Sesi[] | undefined = sesi;

  if (debouncedValue && filteredSesi) {
    filteredSesi = filteredSesi?.filter((sesi) =>
      sesi.nama_sesi.toLowerCase().includes(debouncedValue.toLowerCase())
    );
  }

  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccess(false);
    }, 2500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccess]);

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const onClose = () => {
    setSelectedSesi(null);
  };

  const [currentPage, setCurrentPage] = useState(1);
  // const date now
  if (error) {
    return <p>Error loading sesi.</p>;
  }
  const PAGE_SIZE = 10;
  const MAX_PAGE_DISPLAY = 5; // Jumlah maksimal nomor halaman yang ditampilkan


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  let paginatedSesi: Sesi[] = [];
  let totalPages = 0;
  let pageNumbers: number[] = [];
  if (filteredSesi) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    paginatedSesi = filteredSesi.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredSesi.length / PAGE_SIZE);

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
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg overflow-auto">
            <NavbarPengaturan />
            <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
              <HeadTable
                label="Sesi"
                onClick={() => setShowCreate(true)}
                onChange={handleInputChange}
              />
              <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg scrollbar ">
                {paginatedSesi ? (
                  <>
                    {paginatedSesi.length === 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-500">
                          Sesi tidak ditemukan
                        </h1>
                        <p className="text-sm text-gray-500">
                          Sesi yang anda cari tidak ditemukan
                        </p>
                      </div>
                    ) : (
                      paginatedSesi.map((sesi) => (
                        <CardSesi
                          nama_sesi={sesi.nama_sesi}
                          mulai_sesi={sesi.jam_mulai}
                          selesai_sesi={sesi.jam_selesai}
                          key={sesi.id}
                          onClick={() => {
                            setSelectedSesi(sesi);
                          }}
                          onDelete={() => {
                            setSelectedSesiDelete(sesi);
                          }}
                        />
                      ))
                    )}
                  </>
                ) : (
                  <p>Loading...</p>
                )}
                {selectedSesi && (
                  <ModalDetail titleModal="Edit Sesi" onClose={onClose}>
                    <SesiEdit
                      data={selectedSesi}
                      onClose={onClose}
                      sesiId={selectedSesi.id}
                    />
                  </ModalDetail>
                )}

                {showSuccess && (
                  <ModalDetail
                    titleModal="Modal Ruang"
                    onClose={() => setShowSuccess(false)}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-2xl font-bold text-green-500">
                        Berhasil
                      </h1>
                      <p className="text-sm text-gray-500">
                        {selectedSesi?.nama_sesi} berhasil diupdate
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

                {/* modal delete */}
                {selectedSesiDelete && (
                  <ModalDetail
                    titleModal="Hapus Sesi"
                    onClose={() => setSelectedSesiDelete(null)}
                    silang
                    center
                    wAuto
                  >
                    <DeleteSesi
                      idSesi={selectedSesiDelete.id}
                      onClose={() => setSelectedSesiDelete(null)}
                      onSuccess={() => {
                        setShowSuccess(true);
                      }}
                      data={selectedSesiDelete}
                    />
                  </ModalDetail>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sesi;
