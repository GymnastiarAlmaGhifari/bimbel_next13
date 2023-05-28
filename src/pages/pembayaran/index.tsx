import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HeadTable from "../components/HeadTable";
import Navbar from "../components/Navbar";
import CardPembayaran from "../components/card/CardPembayaranTagihan";

const Pembayaran = () => {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable label="Pembayaran" riwayat />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pembayaran;