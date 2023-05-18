import HeadTable from "@/pages/components/HeadTable";
import Navbar from "@/pages/components/Navbar";
import Sidebar from "@/pages/components/Sidebar";
import CardJadwal from "@/pages/components/card/CardLihatJadwal";
import React from "react";

type Props = {};

const LihatJadwal = (props: Props) => {
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable label="Jadwal Kelompok" />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
              <CardJadwal
                hari="Senin"
                jam_mulai="07:00"
                jam_selesai="09:00"
                nama_tentor="Agimul Karim"
                ruang="Meja Barat"
                sesi="1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LihatJadwal;
