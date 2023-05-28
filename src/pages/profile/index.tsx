import Image from "next/image";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/buttons/Button";
import { MdModeEdit } from "react-icons/md";
import { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className=" w-full bg-red-500 flex flex-col">
        <div className="flex flex-col h-full">
          <Navbar />
          <div className="h-full p-10 bg-Neutral-95">
            <div className="flex gap-7 w-max">
              <div className="flex flex-col gap-6 w-max">
                <div className="h-full w-60">
                  <Image
                    src="https://img.jakpost.net/c/2017/02/15/2017_02_15_21637_1487139254._large.jpg"
                    alt="Foto profile"
                    width={100}
                    height={100}
                    className="rounded w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 items-center">
                  <h1 className="font-bold text-Primary-10">Agimul Karim</h1>
                  <h2 className="inline-block py-2 py-2 px-4 bg-Primary-50 text-Primary-10 rounded-full font-semibold w-full text-center">
                    Admin
                  </h2>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col  gap-1">
                  <h3 className="text-sm text-Neutral-30">No Hp/WA</h3>
                  <span className="font-bold text-sm text-Primary-10">
                    +62 8512345678
                  </span>
                </div>
                <div className="flex flex-col  gap-1">
                  <h3 className="text-sm text-Neutral-30">Alamat</h3>
                  <span className="font-bold text-sm text-Primary-10">
                    Batu Raden
                  </span>
                </div>
                <div className="flex flex-col  gap-1">
                  <h3 className="text-sm text-Neutral-30">Asal Institut</h3>
                  <span className="font-bold text-sm text-Primary-10">UGM</span>
                </div>
                <div className="flex flex-col  gap-1">
                  <h3 className="text-sm text-Neutral-30">Mata Pelajaran</h3>
                  <span className="font-bold text-sm text-Primary-10">
                    Matematika
                  </span>
                </div>
                <div className="mt-24 pl-40">
                  <Button
                    bgColor="bg-Tertiary-50"
                    brColor=""
                    label="Edit Profile"
                    textColor="text-Neutral-100"
                    type="submit"
                    withBgColor
                    icon={MdModeEdit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
