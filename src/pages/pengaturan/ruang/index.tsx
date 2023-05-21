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
  const { data: ruang, error } = useSWR<Ruang[]>("/api/ruang", fetcher, {});

  const [selectedRuang, setSelectedRuang] = useState<Ruang | null>(null);

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

  let filteredRuang = ruang;

  if (debouncedValue) {
    filteredRuang = ruang?.filter((ruang) =>
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

  const onClose = () => {
    setSelectedRuang(null);
  };

  if (error) {
    return <p>Error loading ruang.</p>;
  }

  return (
    <div className="flex flex-row h-screen">
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

                {filteredRuang ? (
                  <>
                    {filteredRuang.length === 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-500">
                          Ruang tidak ditemukan
                        </h1>
                        <p className="text-sm text-gray-500">
                          Ruang yang anda cari tidak ditemukan
                        </p>
                      </div>
                    ) : (
                      filteredRuang.map((ruang) => (
                        <CardRuang
                          key={ruang.id}
                          nama_ruang={ruang.nama_ruang}
                          tipe_ruang={ruang.tipe}
                          onClick={() => {
                            setSelectedRuang(ruang);
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ruang;
