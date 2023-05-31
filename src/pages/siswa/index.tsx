import React, { FC, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeadTable from "../components/HeadTable";
import CardSiswa from "../components/card/CardSiswa";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/modal/Modal";
import { useSession } from "next-auth/react";
import EditSiswa from "./edit";
import CreateSiswa from "./create";
import DetailSiswa from "./detail";
import DeleteSiswa from "./delete.tsx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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
  kelompok: any;
  kelompok_id: string;
}

const Siswa: FC<Siswa> = () => {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  const { data: session, status } = useSession();

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

  const { data: siswa, error } = useSWR<Siswa[]>("/api/siswa", fetcher, {});

  let filteredSiswa: Siswa[] | undefined = siswa;

  if (debouncedValue && filteredSiswa) {
    filteredSiswa = filteredSiswa.filter((siswa) =>
      siswa.nama.toLowerCase().includes(debouncedValue.toLowerCase())
    );
  }

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const [selectedEdit, setSelectedEdit] = useState<Siswa | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<Siswa | null>(null);
  const [selectedDelete, setSelectedDelete] = useState<Siswa | null>(null);

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
    setSelectedDetail(null);
  };

  const PAGE_SIZE = 3;
  const MAX_PAGE_DISPLAY = 5; // Jumlah maksimal nomor halaman yang ditampilkan

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  let paginatedSiswa: Siswa[] = [];
  let totalPages = 0;
  let pageNumbers: number[] = [];
  if (filteredSiswa) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    paginatedSiswa = filteredSiswa.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredSiswa.length / PAGE_SIZE);

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
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable
              label="Siswa"
              onClick={() => setShowCreate(true)}
              onChange={handleInputChange}
            />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
              {paginatedSiswa ? (
                <>
                  {paginatedSiswa.length === 0 ? (
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-2xl font-bold text-Neutral-600">
                        Data Kosong
                      </p>
                      <p className="text-Neutral-500">
                        Silahkan tambahkan data Siswa
                      </p>
                    </div>
                  ) : (
                    <>
                      {paginatedSiswa.map((siswa) => (
                        <CardSiswa
                          key={siswa.id}
                          tipe={siswa.kelompok?.program.tipe}
                          kelas={siswa.kelompok?.program.kelas.nama_kelas}
                          level={siswa.kelompok?.program.level}
                          nama_siswa={siswa.nama}
                          nama_kelompok={siswa.kelompok?.nama_kelompok}
                          gambar={siswa.image}
                          hp={siswa.nomor_telepon}
                          onEdit={() => setSelectedEdit(siswa)}
                          onClick={() => setSelectedDetail(siswa)}
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
                      <p className="text-2xl font-bold text-Neutral-600">
                        Data Kosong
                      </p>
                      <p className="text-Neutral-500">
                        Silahkan tambahkan data siswa
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-2xl font-bold text-Neutral-600">
                        Loading...
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
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
                    className={`  px-4 py-2 rounded-full font-semibold ${
                      currentPage === page
                        ? "bg-Primary-40 text-Neutral-100"
                        : " text-Primary-40 hover:bg-Primary-95 hover:text-Primary-30"
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
          </div>
        </div>
      </div>
      {selectedEdit && (
        <ModalDetail titleModal="Edit Siswa" onClose={backSiswa}>
          <EditSiswa
            data={selectedEdit}
            onClose={backSiswa}
            onSucsess={() => setShowSuccess(true)}
            siswaId={selectedEdit.id}
          />
        </ModalDetail>
      )}
      {/* {
        selectedDelete && (
          <ModalDetail
            titleModal="Hapus Siswa"
            onClose={backSiswa}
          > */}

      {/* create */}

      {showCreate && (
        <ModalDetail
          titleModal="Tambah Siswa"
          onClose={() => setShowCreate(false)}
        >
          <CreateSiswa
            onClose={() => setShowCreate(false)}
            onSucsess={() => setShowSuccess(true)}
          />
        </ModalDetail>
      )}

      {selectedDetail && (
        <ModalDetail titleModal="Detail Siswa" onClose={backSiswa} wAuto>
          <DetailSiswa
            idSiswa={selectedDetail.id}
            onClose={() => setSelectedDetail(null)}
          />
        </ModalDetail>
      )}
      {selectedDelete && (
        <ModalDetail
          titleModal="DeleselectedDelete Siswa"
          onClose={backSiswa}
          center
          silang
          wAuto
        >
          <DeleteSiswa
            idSiswa={selectedDelete.id}
            onClose={() => setSelectedDelete(null)}
            onSuccess={() => setShowSuccess(true)}
            data={selectedDelete}
          />
        </ModalDetail>
      )}
    </div>
  );
};

export default Siswa;
