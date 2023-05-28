import HeadTable from "@/pages/components/HeadTable";
import Navbar from "@/pages/components/Navbar";
import NavbarPengaturan from "@/pages/components/NavbarPengaturan";
import Sidebar from "@/pages/components/Sidebar";
import Button from "@/pages/components/buttons/Button";
import { ModalDetail } from "@/pages/components/modal/Modal";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { IoMdCloud, IoMdCloudUpload } from "react-icons/io";
import CreateDiskon from "./create";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import EditDiskon from "./edit";

interface DiskonProps {
  id: string;
  nama_diskon: string;
  banner: string;
}

const Diskon = ({ }) => {

  const [showCreate, setShowCreate] = useState(false);

  const [selectedDiskonEdit, setSelectedDiskonEdit] = useState<DiskonProps | null>(null);

  const { data: diskon, error, isLoading } = useSWR<DiskonProps[]>(
    "/api/diskon",
    fetcher,
    {}
  );


  const [showSuccess, setShowSuccess] = useState(false);

  const Diskon = ({ }) => {
    useEffect(() => {
      document.title = "Bimbel Linear";
    });
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
              <HeadTable label="Diskon" noSearch
                onClick={() => setShowCreate(true)}
              />
              <div className="grid h-full grid-cols-2 w-full rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg ">
                {
                  isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    diskon?.map((diskon) => (
                      <div
                        key={diskon.id}
                        className="flex flex-col gap-2 w-full h-max rounded-lg border relative">
                        <div className="w-full h-96 rounded-lg bg-red-500">
                          <Image alt="Gambar"
                            width={200}
                            height={200}
                            className="rounded-lg" src={"/api/diskon/img?img=" + diskon.banner} />
                        </div>
                        <div className="flex items-center justify-between px-4 py-2">
                          <h1 className="font-semibold text-Primary-20">
                            {
                              diskon.nama_diskon
                            }
                          </h1>
                          <Button
                            bgColor="bg-Primary-40"
                            withBgColor
                            brColor=""
                            textColor="text-Neutral-100"
                            label="Edit Diskon"
                            type={"button"}
                            onClick={() => {
                              setSelectedDiskonEdit(diskon);
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        selectedDiskonEdit && (
          <ModalDetail
            titleModal="Edit Diskon"
            onClose={() => setSelectedDiskonEdit(null)}
          >
            <EditDiskon />
          </ModalDetail>
        )
      }
      {
        showCreate && (
          <ModalDetail
            titleModal="Tambah Diskon"
            onClose={() => setShowCreate(false)}
          >
            <CreateDiskon
              onClose={() => setShowCreate(false)}
              onSuccess={
                () => {
                  // success
                  setShowSuccess(true);
                }
              }
            />
          </ModalDetail>
        )
      }
      {showSuccess && (
        <ModalDetail
          titleModal="SUCSSES"
          onClose={() => setShowSuccess(false)}
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-green-500">
              Berhasil
            </h1>
          </div>
        </ModalDetail>
      )}
    </div>
  );
};

export default Diskon;
