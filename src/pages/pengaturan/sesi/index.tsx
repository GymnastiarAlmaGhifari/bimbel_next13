import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/modal/Modal";
import SesiEdit from "./edit";
import CardSesi from "@/pages/components/card/CardSesi";
import HeadTable from "@/pages/components/HeadTable";

// import { format, parseISO } from "date-fns";
// import moment from "moment";
// import momentTimezone from "moment-timezone";
// import Sidebar from "@/pages/components/Sidebar";
// import Navbar from "@/pages/components/Navbar";
// import NavbarPengaturan from "@/pages/components/NavbarPengaturan";


interface Sesi {
  id: string;
  nama_sesi: string;
  jam_mulai: string;
  jam_selesai: string;
  createdAt: Date;
  updatedAt: Date;
}

const Sesi: FC<Sesi> = () => {
  const { data: sesi, error } = useSWR<Sesi[]>("/api/sesi", fetcher, {});

  const [selectedSesi, setSelectedSesi] = useState<Sesi | null>(null);

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const onClose = () => {
    setSelectedSesi(null);
  };

  // const date now
  if (error) {
    return <p>Error loading sesi.</p>;
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
              <HeadTable label="Sesi" />
              <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg scrollbar ">
                {sesi ? (
                  <>
                    {sesi.length === 0 ? (
                      <p>No sesi found.</p>
                    ) : (
                      sesi.map((sesi) => (
                        <CardSesi
                          nama_sesi={sesi.nama_sesi}
                          mulai_sesi={sesi.jam_mulai}
                          selesai_sesi={sesi.jam_selesai}
                          key={sesi.id}
                          onClick={() => {
                            setSelectedSesi(sesi);
                          }}
                        />
                      ))
                    )}
                  </>
                ) : (
                  <p>Loading...</p>
                )}

                {selectedSesi && (
                  <ModalDetail titleModal="Edit Sesi" onClose={onClose}>
                    <SesiEdit
                      data={selectedSesi}
                      onClose={onClose}
                      sesiId={selectedSesi.id}
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

export default Sesi;
