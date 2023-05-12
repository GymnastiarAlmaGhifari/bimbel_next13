import { Inter } from "next/font/google";

export default function Diskon() {
  return (
    <div
      id="Diskon"
      className="h-screen flex flex-col px-6 content-center pb-4 bg-gradient-to-b from-blue-400 to-teal-500 pt-14"
    >
      <h1 className="text-center font-bold text-white text-3xl">Diskon</h1>
      <p className="text-center mb-9 text-Neutral-100">Hanya Untuk Bulan Ini</p>
      <div className="h-full bg-white rounded"></div>
    </div>
  );
}
