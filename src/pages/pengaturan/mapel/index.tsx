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

  let filteredMapel = mapel;

  if (debouncedValue) {
    filteredMapel = mapel?.filter((mapel) =>
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

  if (error) {
    return <p>Error loading mapel.</p>;
  }

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
                {filteredMapel ? (
                  <>
                    {filteredMapel.length === 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-500">
                          Program tidak ditemukan
                        </h1>
                        <p className="text-sm text-gray-500">
                          Program yang anda cari tidak ditemukan
                        </p>
                      </div>
                    ) : (
                      filteredMapel.map((item) => (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapel;
