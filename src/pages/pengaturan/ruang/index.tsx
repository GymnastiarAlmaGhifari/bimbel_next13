import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/modal/Modal";
import RuangEdit from "./edit";
import HeadTable from "@/pages/components/HeadTable";
import CardRuang from "@/pages/components/card/CardRuang";
import Create from "./create";
import Sidebar from "@/pages/components/Sidebar";
import Navbar from "@/pages/components/Navbar";
import NavbarPengaturan from "@/pages/components/NavbarPengaturan";
import DeleteRuang from "./delete";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface Ruang {
  id: string;
  nama_ruang: string;
  tipe: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  ruang: Ruang[];
}

const Ruang: FC<Props> = () => {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  const { data: ruang, error } = useSWR<Ruang[]>("/api/ruang", fetcher, {});

  const [selectedRuang, setSelectedRuang] = useState<Ruang | null>(null);
  const [selectedRuangDelete, setSelectedRuangDelete] = useState<Ruang | null>(null);

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

  let filteredRuang: Ruang[] | undefined = ruang;

  if (debouncedValue && filteredRuang) {
    filteredRuang = filteredRuang?.filter((ruang) =>
      ruang.nama_ruang.toLowerCase().includes(debouncedValue.toLowerCase())
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

  const [currentPage, setCurrentPage] = useState(1);

  const onClose = () => {
    setSelectedRuang(null);
  };

  if (error) {
    return <p>Error loading ruang.</p>;
  }
  const PAGE_SIZE = 10;
  const MAX_PAGE_DISPLAY = 5; // Jumlah maksimal nomor halaman yang ditampilkan


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  let paginatedRuang: Ruang[] = [];
  let totalPages = 0;
  let pageNumbers: number[] = [];
  if (filteredRuang) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    paginatedRuang = filteredRuang.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredRuang.length / PAGE_SIZE);

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
                label="Ruang"
                onClick={() => {
                  setShowCreate(true);
                }}
                onChange={handleInputChange}
              />
              <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg scrollbar">
                {paginatedRuang ? (
                  <>
                    {paginatedRuang.length === 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-500">
                          Ruang tidak ditemukan
                        </h1>
                        <p className="text-sm text-gray-500">
                          Ruang yang anda cari tidak ditemukan
                        </p>
                      </div>
                    ) : (
                      paginatedRuang.map((ruang) => (
                        <CardRuang
                          key={ruang.id}
                          nama_ruang={ruang.nama_ruang}
                          tipe_ruang={ruang.tipe}
                          onClick={() => {
                            setSelectedRuang(ruang);
                          }}
                          onDelete={() => {
                            setSelectedRuangDelete(ruang);
                          }}
                        />
                      ))
                    )}
                  </>
                ) : (
                  <p>Loading...</p>
                )}
                {selectedRuang && (
                  <ModalDetail titleModal="Edit Ruang" onClose={onClose}>
                    <RuangEdit
                      data={selectedRuang}
                      onClose={onClose}
                      ruangId={selectedRuang.id}
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
                        {selectedRuang?.nama_ruang} berhasil diupdate
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
                {selectedRuangDelete && (
                  <ModalDetail
                    titleModal="Hapus Ruang"
                    onClose={() => setSelectedRuangDelete(null)}
                    silang
                    center
                    wAuto
                  >
                    <DeleteRuang
                      idRuang={
                        selectedRuangDelete?.id
                      }
                      data={selectedRuangDelete}
                      onClose={() => setSelectedRuangDelete(null)}
                      onSuccess={
                        () => {
                          setShowSuccess(true);
                        }
                      }
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

export default Ruang;
