import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeadTable from "../components/HeadTable";
import CardSiswa from "../components/card/CardSiswa";
import CardKelompok from "../components/card/CardKelompok";
import CardModul from "../components/card/CardModul";

const Modul = () => {
  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable label="Modul" />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
              <CardModul
              kelompok="Reguler" mapel="Matematika" nama_modul="Teori Alajabar" nama_penyusun="Agimul Karim" tanggal_upload="30 Februari 2023" thumbnail="" tipe="Private" url="" tingkatan="3 SMP"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modul;
