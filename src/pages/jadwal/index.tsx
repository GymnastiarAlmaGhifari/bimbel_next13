import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/buttons/Button";
import ItemJadwal from "../components/ItemJadwal";

const Jadwal = () => {
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg">
            <div className="flex justify-between">
              <h1 className="text-lg font-bold">Jadwal</h1>
              <select className="bg-Neutral-100 text-Primary-10 px-4 rounded-lg py-2 w-40 font-semibold">
                <option value="">Ruang A</option>
                <option value="">Ruang B</option>
                <option value="">Meja Timur</option>
                <option value="">Meja Barat</option>
                <option value="">Meja Admin</option>
                <option value="">Belakang</option>
                <option value="">Rumah Siswa</option>
              </select>
            </div>
            <div className="col-span-8 flex flex-row gap-4 h-max">
              <div className="flex justify-center items-center py-2 px-4 bg-Primary-20 border-2 w-full rounded h-full text-Primary-90 font-bold">
                Hari
              </div>
              <div className="flex justify-center items-center py-2 px-4 bg-Primary-20 border-2 w-full rounded h-full text-Primary-90 font-bold">
                Senin
              </div>
              <div className="flex justify-center items-center py-2 px-4 bg-Primary-20 border-2 w-full rounded h-full text-Primary-90 font-bold">
                Selasa
              </div>
              <div className="flex justify-center items-center py-2 px-4 bg-Primary-20 border-2 w-full rounded h-full text-Primary-90 font-bold">
                Rabu
              </div>
              <div className="flex justify-center items-center py-2 px-4 bg-Primary-20 border-2 w-full rounded h-full text-Primary-90 font-bold">
                Kamis
              </div>
              <div className="flex justify-center items-center py-2 px-4 bg-Primary-20 border-2 w-full rounded h-full text-Primary-90 font-bold">
                Jumat
              </div>
              <div className="flex justify-center items-center py-2 px-4 bg-Primary-20 border-2 w-full rounded h-full text-Primary-90 font-bold">
                Sabtu
              </div>
              <div className="flex justify-center items-center py-2 px-4 bg-Primary-20 border-2 w-full rounded h-full text-Primary-90 font-bold">
                Minggu
              </div>
            </div>
            <div className="grid grid-cols-8 grid-rows-4 auto-rows-max grid-flow-row gap-4 h-full">
              <div className="row-span-4 flex flex-col gap-4">
                <div className="flex justify-center items-center py-2 px-4 bg-Primary-20  rounded h-full text-Primary-90 font-bold">
                  Sesi 0
                </div>
                <div className=" flex justify-center items-center py-2 px-4 bg-Primary-20  rounded h-full text-Primary-90 font-bold">
                  Sesi 1
                </div>
                <div className="flex justify-center items-center py-2 px-4 bg-Primary-20  rounded h-full text-Primary-90 font-bold">
                  Sesi 2
                </div>
                <div className="flex justify-center items-center py-2 px-4 bg-Primary-20  rounded h-full text-Primary-90 font-bold">
                  Sesi 3
                </div>
              </div>
              <div className="col-span-7 row-span-4 grid grid-cols-7 grid-rows-4 gap-4">
                <ItemJadwal kelompok="A6" nama_tentor="Agimul Karim"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jadwal;
