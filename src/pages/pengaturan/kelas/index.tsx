import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail, ModalHapus } from "@/pages/components/modal/Modal";
import KelasEdit from "./edit";
import CardKelas from "@/pages/components/card/CardKelas";
import HeadTable from "@/pages/components/HeadTable";
import CreateKelas from "./create";
import DeleteKelas from "./delete";
import Sidebar from "@/pages/components/Sidebar";
import Navbar from "@/pages/components/Navbar";
import NavbarPengaturan from "@/pages/components/NavbarPengaturan";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface Kelas {
  id: string;
  nama_kelas: string;
  createdAt: Date;
  updatedAt: Date;
}

const Kelas: FC<Kelas> = () => {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  const { data: kelas, error } = useSWR<Kelas[]>("/api/kelas", fetcher, {});

  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);

  // delete selected
  const [showDelete, setShowDelete] = useState<Kelas | null>(null);

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

  let filteredKelas: Kelas[] | undefined = kelas;

  if (debouncedValue && filteredKelas) {
    filteredKelas = filteredKelas?.filter((kelas) =>
      kelas.nama_kelas.toLowerCase().includes(debouncedValue.toLowerCase())
    );
  }

  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

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

  const PAGE_SIZE = 10;
  const MAX_PAGE_DISPLAY = 5; // Jumlah maksimal nomor halaman yang ditampilkan

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  let paginatedKelas: Kelas[] = [];
  let totalPages = 0;
  let pageNumbers: number[] = [];
  if (filteredKelas) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    paginatedKelas = filteredKelas.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredKelas.length / PAGE_SIZE);

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

  const onClose = () => {
    setSelectedKelas(null);
  };

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
                label="Kelas"
                onClick={() => setShowCreate(true)}
                onChange={handleInputChange}
              />
              <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
                {paginatedKelas ? (
                  <>
                    {paginatedKelas.length === 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-500">
                          Kelas tidak ditemukan
                        </h1>
                        <p className="text-sm text-gray-500">
                          Kelas yang anda cari tidak ditemukan
                        </p>
                      </div>
                    ) : (
                      paginatedKelas.map((kelas) => (
                        <CardKelas
                          key={kelas.id}
                          nama_kelas={kelas.nama_kelas}
                          onEdit={() => setSelectedKelas(kelas)}
                          onDelete={() => setShowDelete(kelas)}
                        />
                      ))
                    )}
                  </>
                ) : (
                  <p>Loading...</p>
                )}

                {selectedKelas && (
                  <ModalDetail titleModal="Edit Kelas" onClose={onClose}>
                    <KelasEdit
                      kelasId={selectedKelas.id}
                      data={selectedKelas}
                      onClose={onClose}
                    />
                  </ModalDetail>
                )}
                {showSuccess && (
                  <ModalDetail
                    titleModal="Edit Kelompok"
                    onClose={() => setShowSuccess(false)}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-2xl font-bold text-green-500">
                        Berhasil
                      </h1>
                      <p className="text-sm text-gray-500">
                        {selectedKelas?.nama_kelas}Data berhasil diubah
                      </p>
                    </div>
                  </ModalDetail>
                )}

                {/* modal create */}
                {showCreate && (
                  <ModalDetail
                    titleModal="Tambah Kelas"
                    onClose={() => setShowCreate(false)}
                  >
                    <CreateKelas
                      onClose={() => setShowCreate(false)}
                      onSucsess={() => {
                        setShowSuccess(true);
                      }}
                    />
                  </ModalDetail>
                )}
                {showDelete && (
                  <ModalDetail
                    titleModal="Hapus Kelas"
                    wAuto
                    silang
                    center
                    onClose={() => setShowDelete(null)}

                  >
                    <DeleteKelas
                      data={showDelete}
                      onClose={() => setShowDelete(null)}
                      onSucsess={() => {
                        setShowSuccess(true);
                      }}
                      kelasId={showDelete.id}
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

export default Kelas;
