import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeadTable from "../components/HeadTable";
import CardSiswa from "../components/card/CardSiswa";
import CardKelompok from "../components/card/CardKelompok";
import CardModul from "../components/card/CardModul";
import { FC, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail, ModalSucces } from "@/pages/components/modal/Modal";
import Create from "./create";
import EditModul from "./edit";
import DeleteModul from "./delete";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ModulProps {
  id: string;
  nama_module: string;
  url: string;
  thumbnail: string;
  updatedAt: string;
  mapel: {
    nama_mapel: string;
    kelas: {
      nama_kelas: string;
    };
  };
}

const Modul: FC<ModulProps> = () => {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });

  const { data: modul, error } = useSWR<ModulProps[]>(
    "/api/modul",
    fetcher,
    {}
  );

  const [showCreate, setShowCreate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [selectedEdit, setSelectedEdit] = useState<ModulProps | null>(null);
  const [selectedDelete, setSelectedDelete] = useState<ModulProps | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccess(false);
    }, 2500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccess]);

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

  let filteredModul: ModulProps[] | undefined = modul;

  if (debouncedValue && filteredModul) {
    filteredModul = filteredModul.filter((modul) =>
      modul.nama_module.toLowerCase().includes(debouncedValue.toLowerCase())
    );
  }

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const PAGE_SIZE = 10;
  const MAX_PAGE_DISPLAY = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  let paginatedModul: ModulProps[] = [];
  let totalPages = 0;
  let pageNumbers: number[] = [];
  if (filteredModul) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    paginatedModul = filteredModul.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredModul.length / PAGE_SIZE);

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
              label="Modul"
              onClick={() => {
                setShowCreate(true);
              }}
              onChange={handleInputChange}
            />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
              {paginatedModul ? (
                <>
                  {paginatedModul.length === 0 ? (
                    <p className="text-2xl text-Neutral-500 text-center">
                      Tidak ada Modul
                    </p>
                  ) : (
                    paginatedModul.map((modul) => (
                      <CardModul
                        key={modul.id}
                        kelompok="Reguler"
                        mapel={modul.mapel.nama_mapel}
                        nama_module={modul.nama_module}
                        tanggal_upload={modul.updatedAt}
                        thumbnail={modul.thumbnail}
                        url={modul.url}
                        tingkatan={modul.mapel.kelas.nama_kelas}
                        goPdf={() => {
                          window.open(
                            "/api/modul/pdf?modul=" + modul.url,
                            "_blank"
                          );
                        }}
                        onEdit={() => {
                          setSelectedEdit(modul);
                        }}
                        onDelete={() => {
                          setSelectedDelete(modul);
                        }}
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
          </div>
        </div>
      </div>
      {showSuccess && (
        <ModalSucces label="POOP" onClose={() => setShowSuccess(false)}>

        </ModalSucces>
      )}

      {/* modal create */}
      {showCreate && (
        <ModalDetail
          titleModal="Tambah Modul"
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

      {selectedEdit && (
        <ModalDetail
          titleModal="Edit Modul"
          onClose={() => setSelectedEdit(null)}
        >
          <EditModul
            onClose={() => setSelectedEdit(null)}
            onSucces={() => {
              setShowSuccess(true);
            }}
            data={selectedEdit}
            modulId={selectedEdit.id}
          />
        </ModalDetail>
      )}

      {
        selectedDelete && (
          <ModalDetail
            titleModal="Hapus Modul"
            onClose={() => setSelectedDelete(null)}
          >
            <DeleteModul
              onClose={() => setSelectedDelete(null)}
              onSuccess={
                () => {
                  setShowSuccess(true);
                }
              }
              idModul={selectedDelete.id}
            />
          </ModalDetail>
        )
      }

    </div>
  );
};

export default Modul;
