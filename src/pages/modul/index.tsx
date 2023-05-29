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
            />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
              {modul ? (
                <>
                  {modul.length === 0 ? (
                    <p className="text-2xl text-Neutral-500 text-center">
                      Tidak ada modul
                    </p>
                  ) : (
                    modul.map((modul) => (
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
