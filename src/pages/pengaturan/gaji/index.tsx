import HeadTable from "@/pages/components/HeadTable";
import Navbar from "@/pages/components/Navbar";
import NavbarPengaturan from "@/pages/components/NavbarPengaturan";
import Sidebar from "@/pages/components/Sidebar";
import Button from "@/pages/components/buttons/Button";
import CardGaji from "@/pages/components/card/CardGaji";
import CardRekening from "@/pages/components/card/CardRekening";
import React, { FC, useState } from "react";
import { IoIosAdd } from "react-icons/io";

type GajiProps = {};

const Gaji: FC<GajiProps> = () => {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />

      <div className="w-full flex flex-col">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg overflow-auto">
            <NavbarPengaturan />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-auto">
              <div className="flex gap-5 overflow-auto">
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
                      // onClick={onClick}
                      outlined
                    />
                  </div>
                  <div className="flex flex-col gap-4 overflow-y-auto scrollbar scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg pr-2">
                    <CardGaji role="Admin" gaji="Rp. 3000000" />
                    <CardGaji role="Admin" gaji="Rp. 3000000" />
                    <CardGaji role="Admin" gaji="Rp. 3000000" />
                    <CardGaji role="Admin" gaji="Rp. 3000000" />
                  </div>
                </div>
                <div className="h-full w-[1px] bg-Neutral-90"></div>
                <div className="flex flex-col w-[500px] gap-4">
                  <div className="flex justify-between w-full">
                    <h1 className="text-xl font-semibold text-Primary-10">
                      Rekening
                    </h1>
                  </div>
                  <CardRekening nama_rek="BRI" no_rek="098765433456789" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gaji;
