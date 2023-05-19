import React from "react";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import Navbar from "../components/Navbar";
import TimePicker from "../components/TimePicker";
import Dropdown from "../components/Dropdown";
import NavbarPengaturan from "../components/NavbarPengaturan";
import Sesi from "./sesi";
import Ruang from "./ruang";
const Pengaturan = () => {
  // const handleTimeChange = (hour: number, minute: number) => {
  //   console.log(`Selected time: ${hour}:${minute}`);
  //   // Lakukan apa pun dengan nilai jam dan menit yang dipilih
  // };

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />

      <div className="w-full flex flex-col">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg">
            <NavbarPengaturan />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;
