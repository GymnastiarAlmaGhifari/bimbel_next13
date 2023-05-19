import React from "react";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import Navbar from "../components/Navbar";
import TimePicker from "../components/TimePicker";
const Pengaturan = () => {
  const handleTimeChange = (hour: number, minute: number) => {
    console.log(`Selected time: ${hour}:${minute}`);
    // Lakukan apa pun dengan nilai jam dan menit yang dipilih
  };

  return (
    <div className="flex flex-row">
      <Sidebar />

      <div className="ml-10 w-full">
        <Navbar />
        <div className="ml-80">
          <Link href="/pengaturan/ruang">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              ruang
            </button>
          </Link>
          <Link href="/pengaturan/sesi">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              sesi
            </button>
          </Link>
          <Link href="/pengaturan/mapel">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              mapel
            </button>
          </Link>
          <Link href="/pengaturan/kelas">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              kelas
            </button>
          </Link>
          <Link href="/pengaturan/program">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              program
            </button>
          </Link>
        </div>
        {/* <TimePicker
        //  onTimeChange={handleTimeChange}

        /> */}
      </div>
    </div>
  );
};

export default Pengaturan;
