import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/modal/Modal";
import MapelEdit from "./edit";
import CardMapel from "@/pages/components/card/CardMapel";
import HeadTable from "@/pages/components/HeadTable";
import CreateMapel from "./create";
import Sidebar from "@/pages/components/Sidebar";
import Navbar from "@/pages/components/Navbar";
import NavbarPengaturan from "@/pages/components/NavbarPengaturan";
import DeleteMapel from "./delete";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface Mapel {
  kelas: any;
  id: string;
  nama_mapel: string;
  nama_kelas: string;
  createdAt: Date;
  updatedAt: Date;
}

const Mapel: FC<Mapel> = () => {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  const { data: mapel, error } = useSWR<Mapel[]>("/api/mapel", fetcher, {});

  const [selectedMapel, setSelectedMapel] = useState<Mapel | null>(null);
  const [selectedMapelDelete, setSelectedMapelDelete] = useState<Mapel | null>(
    null
  );

  // open modal create
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

  let filteredMapel: Mapel[] | undefined = mapel;

  if (debouncedValue && filteredMapel) {
    filteredMapel = filteredMapel?.filter((mapel) =>
      mapel.nama_mapel.toLowerCase().includes(debouncedValue.toLowerCase())
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

  const onClose = () => {
    setSelectedMapel(null);
  };

  const [currentPage, setCurrentPage] = useState(1);
  if (error) {
    return <p>Error loading mapel.</p>;
  }
  const PAGE_SIZE = 10;
  const MAX_PAGE_DISPLAY = 5; // Jumlah maksimal nomor halaman yang ditampilkan


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  let paginatedMapel: Mapel[] = [];
  let totalPages = 0;
  let pageNumbers: number[] = [];
  if (filteredMapel) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    paginatedMapel = filteredMapel.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredMapel.length / PAGE_SIZE);

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
                label="Mata Pelajaran"
                onClick={() => setShowCreate(true)}
                onChange={handleInputChange}
              />
              <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
                {paginatedMapel ? (
                  <>
                    {paginatedMapel.length === 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-500">
                          Mapel tidak ditemukan
                        </h1>
                        <p className="text-sm text-gray-500">
                          Mapel yang anda cari tidak ditemukan
                        </p>
                      </div>
                    ) : (
                      paginatedMapel.map((item) => (
                        <CardMapel
                          key={item.id}
                          nama_kelas={item.kelas?.nama_kelas}
                          nama_mapel={item.nama_mapel}
                          onClick={() => setSelectedMapel(item)}
                          onDelete={() => setSelectedMapelDelete(item)}
                        />
                      ))
                    )}
                  </>
                ) : (
                  <p>Loading...</p>
                )}
                {selectedMapel && (
                  <ModalDetail titleModal="Edit Mapel" onClose={onClose}>
                    <MapelEdit
                      data={selectedMapel}
                      onClose={onClose}
                      mapelId={selectedMapel.id}
                    />
                  </ModalDetail>
                )}
                {/* buat modal dari getname  */}
                {showSuccess && (
                  <ModalDetail
                    titleModal="SUCSSES"
                    onClose={() => setShowSuccess(false)}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-2xl font-bold text-green-500">
                        Berhasil
                      </h1>
                      <p className="text-sm text-gray-500">
                        {selectedMapel?.nama_mapel}Data berhasil diubah
                      </p>
                    </div>
                  </ModalDetail>
                )}

                {/* modal create */}
                {showCreate && (
                  <ModalDetail
                    titleModal="Tambah Mapel"
                    onClose={() => setShowCreate(false)}
                  >
                    <CreateMapel
                      onClose={() => setShowCreate(false)}
                      onSucsess={() => {
                        setShowSuccess(true);
                      }}
                    />
                  </ModalDetail>
                )}
                {
                  // modal delete
                  selectedMapelDelete && (
                    <ModalDetail
                      titleModal="Hapus Mapel"
                      onClose={() => setSelectedMapelDelete(null)}
                      silang
                      wAuto
                      center
                    >
                      <DeleteMapel
                        idMapel={selectedMapelDelete.id}
                        onClose={() => setSelectedMapelDelete(null)}
                        onSuccess={() => {
                          setShowSuccess(true);
                        }
                        }
                        data={selectedMapelDelete}
                      />
                    </ModalDetail>
                  )
                }
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

export default Mapel;
