"use client";
import { Inter } from "next/font/google";

import Button from "@/pages/components/buttons/Button";
import Diskon from "./Diskon";
// import { Parallax } from 'react-parallax';

export default function Header() {
  const downloadAppMobile = () => {
    alert("Download App");
  };
  return (
    <div
      id="Home"
      className="flex flex-col h-screen bg-gradient-to-b from-blue-400 to-teal-500"
    >
      <section id="hero" className="flex justify-between h-full w-full">
        <div className="flex flex-col justify-center w-full pl-40 gap-12">
          <div>
            <h1 className="text-5xl font-bold text-white ">BIMBEL LINEAR</h1>
            <p className="text-white ">Solusi Pintar Teman Belajar</p>
          </div>
          <Button
            bgColor="bg-Neutral-100"
            onClick={downloadAppMobile}
            label="Download Aplikasi Mobile"
          />
        </div>
        <div className="w-full"></div>
      </section>
    </div>
  );
}
