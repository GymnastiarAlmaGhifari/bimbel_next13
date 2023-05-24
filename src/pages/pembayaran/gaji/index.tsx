import HeadTable from "@/pages/components/HeadTable";
import Navbar from "@/pages/components/Navbar";
import NavbarPembayaran from "@/pages/components/NavbarPembayaran";
import Sidebar from "@/pages/components/Sidebar";
import CardPembayaran from "@/pages/components/card/CardPembayaran";
import React from "react";

const Pembayaran = () => {
  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto ">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg overflow-auto">
            <NavbarPembayaran />
            <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
              <HeadTable bulanPembayaran tahunPembayaran label="Gaji" riwayat />
              <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar">
                <CardPembayaran
                  bulan="Mei"
                  jumlah_tagihan="Rp. 1000000"
                  kelas="3 SMP"
                  nama_siswa="Agimul Karim"
                  status="Belum Dibayar"
                  tahun="2023"
                  tanggal_approve=""
                  tanggal_bayar=""
                  tanggal_jatuh_tempo="1 Juni 2023"
                  tanggal_tagihan="1 Juni 2023"
                  tipe="Reguler"
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
