import HeadTable from "@/pages/components/HeadTable";
import Navbar from "@/pages/components/Navbar";
import NavbarPembayaran from "@/pages/components/NavbarPembayaran";
import Sidebar from "@/pages/components/Sidebar";
import CardPembayaran from "@/pages/components/card/CardPembayaranTagihan";
import React, { FC, useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail, ModalSucces } from "@/pages/components/modal/Modal";
import LihatNota from "../modal/nota";
import Acc from "../modal/acc";
import Create from "../modal/create";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import DeleteTagihan from "../modal/delete";
import EditRekening from "../modal/rekening";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "@/pages/components/buttons/Button";

interface Pembayaran {
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

interface RekeningProps {
  id: string;
  nama_rekening: string;
  nomor_rekening: string;
}

const Pembayaran: FC<Pembayaran> = () => {
  const {
    data: pembayaran,
    error,
    isLoading,
  } = useSWR("/api/tagihan", fetcher);

  const { data: session, status } = useSession();
  const router = useRouter();

  // state shownota
  const [showNota, setShowNota] = useState<Pembayaran | null>(null);

  const [AcceptPembayaran, setAcceptPembayaran] = useState<Pembayaran | null>(
    null
  );

  // create
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const [selectedDelete, setSelectedDelete] = useState<Pembayaran | null>(null);


  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  const [showSuccess, setShowSuccess] = useState(false);

  const [showRekening, setShowRekening] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccess(false);
    }, 2500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccess]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);


  let filteredPembayaran: Pembayaran[] | undefined = pembayaran;

  if (debouncedValue && filteredPembayaran) {
    filteredPembayaran = filteredPembayaran.filter((pembayaran) =>
      pembayaran.siswa.nama.toLowerCase().includes(debouncedValue.toLowerCase())
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

  let paginatedPembayaran: Pembayaran[] = [];
  let totalPages = 0;
  let pageNumbers: number[] = [];
  if (filteredPembayaran) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    paginatedPembayaran = filteredPembayaran.slice(startIndex, endIndex);
    totalPages = Math.ceil(filteredPembayaran.length / PAGE_SIZE);

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


  const { data: rekening, error: errorrekening } = useSWR(
    "/api/rekening",
    fetcher,
    {}
  );

  // map daata rekening sim


  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg overflow-auto">
            <NavbarPembayaran />
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
                        label="Tagihan"
                        riwayat
                        onClick={() => setShowCreate(true)}
                        onHistory={() => {
                        }}
                        url="/pembayaran/riwayatPembayaran"
                        onChange={handleInputChange}
                        onRekening={
                          () => {
                            setShowRekening(rekening);
                          }
                        }
                      />
                      <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
                        {paginatedPembayaran ? (
                          <>
                            {paginatedPembayaran.length === 0 ? (
                              <div className="flex flex-col justify-center items-center">
                                <p className="text-2xl font-bold text-Neutral-600">
                                  Data Kosong
                                </p>
                                <p className="text-Neutral-500">PP</p>
                              </div>
                            ) : (
                              <>
                                {paginatedPembayaran.map((pembayaran: Pembayaran) => (
                                  <CardPembayaran
                                    key={pembayaran.id}
                                    bulan={pembayaran.Bulan}
                                    jumlah_tagihan={pembayaran?.jumlah_tagihan}
                                    nama_rekening={pembayaran?.nama_rekening}
                                    nama_siswa={pembayaran?.siswa?.nama}
                                    nama_user={pembayaran?.user?.name}
                                    nomor_rekening={pembayaran?.nomor_rekening}
                                    nota={pembayaran?.nota}
                                    status={pembayaran?.status}
                                    tanggal_approve={pembayaran?.tanggal_approve}
                                    tanggal_bayar={pembayaran?.tanggal_bayar}
                                    tanggal_jatuh_tempo={
                                      pembayaran?.tanggal_jatuh_tempo
                                    }
                                    tanggal_tagihan={pembayaran?.tanggal_tagihan}
                                    gambar={pembayaran?.siswa.image}
                                    tahun={pembayaran?.Tahun}
                                    onClick={() => setShowNota(pembayaran)}
                                    onAccept={() => setAcceptPembayaran(pembayaran)}
                                    onDelete={() => setSelectedDelete(pembayaran)}
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
                    </>
                  )}
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <ModalSucces label="" onClose={() => setShowSuccess(false)}>
        </ModalSucces>
      )}
      {showNota && (
        <ModalDetail silang
          titleModal={`Nota Tagihan ${showNota.siswa.nama} pada ${showNota.Bulan} ${showNota.Tahun}`}
          onClose={() => setShowNota(null)}
        >
          <LihatNota data={showNota} onClose={() => setShowNota(null)} />
        </ModalDetail>
      )}
      {AcceptPembayaran && (
        <ModalDetail center wAuto
          titleModal="Konfirmasi Pembayaran"
          onClose={() => setAcceptPembayaran(null)}
        >
          <Acc
            idAcc={AcceptPembayaran.id}
            data={AcceptPembayaran}
            onClose={() => setAcceptPembayaran(null)}
            onSuccess={() => {
              setShowSuccess(true);
            }}
          />
        </ModalDetail>
      )}
      {showCreate && (
        <ModalDetail
          titleModal="Tambah Tagihan"
          onClose={() => setShowCreate(false)}
        >
          <Create
            onClose={
              () => setShowCreate(false)
            }
            onSucsess={() => {
              setShowSuccess(true);
            }}
          />
        </ModalDetail>
      )}
      {selectedDelete && (
        <ModalDetail
          titleModal="Delete Tagihan"
          onClose={
            () => setSelectedDelete(null)
          }
          center
          silang
          wAuto
        >
          <DeleteTagihan
            idTagihan={selectedDelete.id}
            onClose={() => setSelectedDelete(null)}
            onSuccess={() => {
              setShowSuccess(true);
            }}
            data={selectedDelete}
          />
        </ModalDetail>
      )}
      {
        showRekening && (
          <ModalDetail
            titleModal="Gaji"
            onClose={() => setShowRekening(null)}
          >
            <EditRekening
              onClose={() => setShowRekening(null)}
              onSucsess={() => {
                setShowSuccess(true);
              }
              }
              data={showRekening}
            />
          </ModalDetail>
        )

      }
    </div>
  );
};

export default Pembayaran;
