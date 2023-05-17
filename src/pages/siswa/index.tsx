import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeadTable from "../components/HeadTable";
import CardSiswa from "../components/card/CardSiswa";

const Siswa = () => {
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-10 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable label="Siswa" />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
              <CardSiswa
                tipe="Private"
                kelas="3 SMP"
                kelompok="Reguler"
                nama_siswa="Agimul Karim"
                status="Aktif"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Siswa;
