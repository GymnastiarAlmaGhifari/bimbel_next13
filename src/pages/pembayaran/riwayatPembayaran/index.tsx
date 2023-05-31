import HeadTable from "@/pages/components/HeadTable";
import Navbar from "@/pages/components/Navbar";
import Sidebar from "@/pages/components/Sidebar";
import CardPembayaran from "@/pages/components/card/CardPembayaranTagihan";
import React, { FC, useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/modal/Modal";
import LihatNota from "../modal/nota";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface RiwayatPembayaran {
  id: string;
  nama_rekening: string;
  nomor_rekening: string;
  jumlah_tagihan: number;
  tanggal_tagihan: string;
  tanggal_jatuh_tempo: string;
  tanggal_bayar: string;
  tanggal_approve: string;
  Bulan: string;
  Tahun: number;
  status: string;
  nota: string;
  user: {
    name: string;
  };
  siswa: {
    nama: string;
    image: string;
  };
}

const RiwayatPembayaran: FC<RiwayatPembayaran> = () => {
  const { data: riwayat, error } = useSWR<RiwayatPembayaran[]>("/api/tagihan/riwayat", fetcher);

  const [showNota, setShowNota] = useState<RiwayatPembayaran | null>(null);

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


  let filteredRiwayat: RiwayatPembayaran[] | undefined = riwayat;

  if (debouncedValue && filteredRiwayat) {
    filteredRiwayat = filteredRiwayat.filter((riwayat) =>
      riwayat.siswa.nama.toLowerCase().includes(debouncedValue.toLowerCase())
    );
  }

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const PAGE_SIZE = 10;
  const MAX_PAGE_DISPLAY = 5; // Jumlah maksimal nomor halaman yang ditampilkan

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  let paginatedRiwayat: RiwayatPembayaran[] = [];
  let totalPages = 0;
  let pageNumbers: number[] = [];
  if (filteredRiwayat) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    paginatedRiwayat = filteredRiwayat.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredRiwayat.length / PAGE_SIZE);

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
            <HeadTable label="Riwayat Pembayaran" noAdd
              onChange={handleInputChange}
            />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
              {paginatedRiwayat ? (
                <>
                  {paginatedRiwayat.length === 0 ? (
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-2xl font-bold text-Neutral-600">
                        Data Kosong
                      </p>
                      <p className="text-Neutral-500">
                        Data riwayat pembayaran tidak ditemukan
                      </p>
                    </div>
                  ) : (
                    <>
                      {paginatedRiwayat.map((riwayat: RiwayatPembayaran) => (
                        <CardPembayaran
                          key={riwayat.id}
                          bulan={riwayat.Bulan}
                          jumlah_tagihan={riwayat?.jumlah_tagihan}
                          nama_rekening={riwayat?.nama_rekening}
                          nama_siswa={riwayat?.siswa?.nama}
                          nama_user={riwayat?.user?.name}
                          nomor_rekening={riwayat?.nomor_rekening}
                          nota={riwayat?.nota}
                          status={riwayat?.status}
                          tanggal_approve={riwayat?.tanggal_approve}
                          tanggal_bayar={riwayat?.tanggal_bayar}
                          tanggal_jatuh_tempo={riwayat?.tanggal_jatuh_tempo}
                          tanggal_tagihan={riwayat?.tanggal_tagihan}
                          gambar={riwayat?.siswa.image}
                          tahun={riwayat?.Tahun}
                          onClick={() => setShowNota(riwayat)}
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
      {showNota && (
        <ModalDetail
          titleModal="Detail Tagihan"
          onClose={() => setShowNota(null)}
        >
          <LihatNota data={showNota} onClose={() => setShowNota(null)} />
        </ModalDetail>
      )}
    </div>
  );
};

export default RiwayatPembayaran;
