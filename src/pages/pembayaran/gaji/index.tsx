import HeadTable from "@/pages/components/HeadTable";
import Navbar from "@/pages/components/Navbar";
import NavbarPembayaran from "@/pages/components/NavbarPembayaran";
import Sidebar from "@/pages/components/Sidebar";
import CardPembayaranGaji from "@/pages/components/card/CardPembayaranGaji";
import CardPembayaran from "@/pages/components/card/CardPembayaranTagihan";
import React, { useState } from "react";

const Pembayaran = () => {

  const [showCreate, setShowCreate] = useState<boolean>(false);

  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg overflow-auto">
            <NavbarPembayaran />
            <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
              <HeadTable
                label="Gaji"
                riwayat
                onClick={() => setShowCreate(true)}
                onHistory={() => {

                }}
                url="/pembayaran/riwayatGaji"

              />
              <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
                <CardPembayaranGaji
                  tipe_pembayaran="Transfer"
                  bulan="Mei"
                  jumlah_gaji="Rp. 1000000"
                  nama_user="Agimul Karim"
                  status="Dibayar"
                  tahun="2023"
                  tanggal_approve=""
                  tanggal_bayar="3 Juni 2023"
                  tanggal_gaji="1"
                  tipe="Admin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pembayaran;
