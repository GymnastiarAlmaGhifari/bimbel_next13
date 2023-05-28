import HeadTable from "@/pages/components/HeadTable";
import Navbar from "@/pages/components/Navbar";
import NavbarPengaturan from "@/pages/components/NavbarPengaturan";
import Sidebar from "@/pages/components/Sidebar";
import Button from "@/pages/components/buttons/Button";
import CardGaji from "@/pages/components/card/CardGaji";
import CardRekening from "@/pages/components/card/CardRekening";
import React, { FC, useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import {
  ModalDetail,
  ModalHapus,
  ModalSucces,
} from "@/pages/components/modal/Modal";
import CreateGaji from "./create";
import GajiEdit from "./edit";
import RekeningEdit from "./editRekening";

type GajiProps = {
  id?: string;
  jumlah_gaji?: number;
  role?: string;
};

interface RekeningProps {
  id?: string;
  nama_rekening?: string;
  nomor_rekening?: string;
}

const Gaji: FC<GajiProps> = () => {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  const { data: gaji, error: errorgaji } = useSWR<GajiProps[]>(
    "/api/setgaji",
    fetcher,
    {}
  );

  const { data: rekening, error: errorrekening } = useSWR<RekeningProps[]>(
    "/api/rekening",
    fetcher,
    {}
  );

  const [showDelete, setShowDelete] = useState<GajiProps | null>(null);

  const [showCreate, setShowCreate] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [selectedGaji, setSelectedGaji] = useState<GajiProps | null>(null);

  const [selectedRekening, setSelectedRekening] =
    useState<RekeningProps | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccess(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccess]);

  // const onClose = () => {
  //   setSelectedKelas(null);
  // };

  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />

      <div className="w-full flex flex-col">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg overflow-auto">
            <NavbarPengaturan />
            <div className="flex flex-col h-full rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-auto">
              <div className="flex gap-5 overflow-auto h-full">
                <div className="flex flex-col gap-4 w-full overflow-auto">
                  <div className="flex justify-between w-full items-center">
                    <h1 className="text-xl font-semibold text-Primary-10">
                      Gaji
                    </h1>
                    <Button
                      type="button"
                      brColor="border-Tertiary-50"
                      textColor="text-Tertiary-50"
                      bgColor="bg-Tertiary-50"
                      label="Tambah"
                      icon={IoIosAdd}
                      onClick={() => setShowCreate(true)}
                      outlined
                    />
                  </div>
                  <div className="flex flex-col gap-4 h-full overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg pr-2">
                    {gaji ? (
                      <>
                        {gaji.length === 0 ? (
                          <div className="flex flex-col items-center justify-center">
                            <h1 className="text-2xl font-bold text-gray-500">
                              Tidak Ada List Gaji
                            </h1>
                          </div>
                        ) : (
                          gaji.map((gaji) => (
                            <CardGaji
                              key={gaji.id}
                              gaji={gaji.jumlah_gaji}
                              role={gaji.role}
                              onEdit={() => setSelectedGaji(gaji)}
                            />
                          ))
                        )}
                      </>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                </div>
                <div className="h-full w-[1px] bg-Neutral-90"></div>
                <div className="flex flex-col w-[500px] gap-4">
                  <div className="flex justify-between w-full">
                    <h1 className="text-xl font-semibold text-Primary-10">
                      Rekening
                    </h1>
                  </div>
                  {rekening ? (
                    <>
                      {rekening.length === 0 ? (
                        <div className="flex flex-col items-center justify-center">
                          <h1 className="text-2xl font-bold text-gray-500">
                            Tidak Ada List Rekening
                          </h1>
                        </div>
                      ) : (
                        rekening.map((rekening) => (
                          <CardRekening
                            key={rekening.id}
                            nama_rek={rekening.nama_rekening}
                            no_rek={rekening.nomor_rekening}
                            onClick={() => setSelectedRekening(rekening)}
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
        </div>
      </div>
      {showCreate && (
        <ModalDetail
          titleModal="Tambah Gaji"
          onClose={() => setShowCreate(false)}
        >
          <CreateGaji
            onClose={() => setShowCreate(false)}
            onSucsess={() => setShowSuccess(true)}
          />
        </ModalDetail>
      )}
      {showSuccess && (
        <ModalSucces label="POOP" onClose={() => setShowSuccess(false)}>
          <div className="">oawkowkao</div>
        </ModalSucces>
      )}
      {selectedGaji && (
        <ModalDetail
          titleModal="Edit Gaji"
          onClose={() => setSelectedGaji(null)}
        >
          <GajiEdit
            gajiId={selectedGaji.id}
            data={selectedGaji}
            onSucsess={() => setShowSuccess(true)}
            onClose={() => setSelectedGaji(null)}
          />
        </ModalDetail>
      )}
      {selectedRekening && (
        <ModalDetail
          titleModal="Edit Rekening"
          onClose={() => setSelectedRekening(null)}
        >
          <RekeningEdit
            rekeningId={selectedRekening.id}
            data={selectedRekening}
            onSucsess={() => setShowSuccess(true)}
            onClose={() => setSelectedRekening(null)}
          />
        </ModalDetail>
      )}
    </div>
  );
};

export default Gaji;
