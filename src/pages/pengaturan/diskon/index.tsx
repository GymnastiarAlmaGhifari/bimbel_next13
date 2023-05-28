import HeadTable from "@/pages/components/HeadTable";
import Navbar from "@/pages/components/Navbar";
import NavbarPengaturan from "@/pages/components/NavbarPengaturan";
import Sidebar from "@/pages/components/Sidebar";
import Button from "@/pages/components/buttons/Button";
import Image from "next/image";
import React from "react";
import { IoMdCloud, IoMdCloudUpload } from "react-icons/io";

interface DiskonProps {}

const Diskon = ({}) => {
  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg overflow-auto">
            <NavbarPengaturan />
            <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
              <div className="grid h-full grid-cols-2 gap-2 w-full rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg scrollbar">
                <div className="flex flex-col gap-2 w-full h-max rounded-lg border relative">
                  <div className="w-full h-96 rounded-lg bg-red-500">
                    <Image alt="" src={""} />
                  </div>
                  <div className="flex items-center justify-between px-4 py-2">
                    <h1 className="font-semibold text-Primary-20">
                      Nama Diskon
                    </h1>
                    <Button
                      bgColor="bg-Primary-40"
                      withBgColor
                      brColor=""
                      textColor="text-Neutral-100"
                      label="Ganti Gambar"
                      type={"button"}
                      icon={IoMdCloudUpload}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diskon;
