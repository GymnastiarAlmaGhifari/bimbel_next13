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
import Sidebar from "@/pages/components/Sidebar";
import Navbar from "@/pages/components/Navbar";
import NavbarPengaturan from "@/pages/components/NavbarPengaturan";
import DeleteMapel from "./delete";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "@/pages/components/buttons/Button";

interface Program {
  kelas: any;
  id: string;
  nama_program: string;
  level: string;
  tipe: string;
  Deskripsi: string;
  harga: number;
  img: string;
  nama_kelas: string;
  createdAt: Date;
  updatedAt: Date;
}

const Program: FC<Program> = () => {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  const { data: program, error } = useSWR<Program[]>(
    "/api/program",
    fetcher,
    {}
  );
  const { data: session, status } = useSession();
  const router = useRouter();

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

  let filteredProgram: Program[] | undefined = program;

  if (debouncedValue && filteredProgram) {
    filteredProgram = filteredProgram?.filter((program) =>
      program.nama_program.toLowerCase().includes(debouncedValue.toLowerCase())
    );
  }

  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const [selectedProgramDelete, setSelectedProgramDelete] = useState<Program | null>(null);

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


  const [currentPage, setCurrentPage] = useState(1);

  const onClose = () => {
    setSelectedProgram(null);
  };

  if (error) {
    return <p>Error loading program.</p>;
  }

  const PAGE_SIZE = 10;
  const MAX_PAGE_DISPLAY = 5; // Jumlah maksimal nomor halaman yang ditampilkan



  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  let paginatedProgram: Program[] = [];
  let totalPages = 0;
  let pageNumbers: number[] = [];
  if (filteredProgram) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    paginatedProgram = filteredProgram.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredProgram.length / PAGE_SIZE);

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
              {
                session?.user.role === "TENTOR"
                  || session?.user.role === "ADMIN"
                  ? (
                    <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
                      <h1 className="text-2xl font-bold text-gray-500">
                        Hanya Super Admin yang bisa mengakses halaman ini
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
                        label="Program"
                        onClick={() => setShowCreate(true)}
                        onChange={handleInputChange}
                      />
                      <div className="grid grid-cols-2 rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg scrollbar">
                        {paginatedProgram ? (
                          <>
                            {paginatedProgram.length === 0 ? (
                              <div className="flex flex-col items-center justify-center">
                                <h1 className="text-2xl font-bold text-gray-500">
                                  Program tidak ditemukan
                                </h1>
                                <p className="text-sm text-gray-500">
                                  Program yang anda cari tidak ditemukan
                                </p>
                              </div>
                            ) : (
                              paginatedProgram.map((item) => (
                                <CardProgram
                                  mapel_ajar="Semua Mata Pelajaran TryOut"
                                  deskripsi={item.Deskripsi}
                                  key={item.id}
                                  nama_program={item.nama_program}
                                  tipe={item.tipe}
                                  level={item.level}
                                  kelas={item.kelas.nama_kelas}
                                  harga={item.harga}
                                  onEdit={() => setSelectedProgram(item)}
                                  gambar={item?.img}
                                  onDelete={() => setSelectedProgramDelete(item)}
                                />
                              ))
                            )}
                          </>
                        ) : (
                          <p>Loading...</p>
                        )}

                        {selectedProgram && (
                          <ModalDetail titleModal="Edit Program" onClose={onClose}>
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
                              <h1 className="text-2xl font-bold text-green-500">
                                Berhasil
                              </h1>
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

                        {/* modal delete */}
                        {selectedProgramDelete && (
                          <ModalDetail
                            titleModal="Hapus Program"
                            onClose={() => setSelectedProgramDelete(null)}
                            wAuto
                            silang
                            center
                          >
                            <DeleteMapel
                              data={selectedProgramDelete}
                              idProgram={selectedProgramDelete.id}
                              onClose={() => setSelectedProgramDelete(null)}
                              onSuccess={() => {
                                setShowSuccess(true);
                              }}

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
                    </>
                  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Program;
