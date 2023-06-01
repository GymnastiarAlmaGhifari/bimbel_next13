"use client";
import { Inter } from "next/font/google";

import Button from "@/pages/components/buttons/Button";
import Diskon from "./Diskon";
import path from "path";
// import { Parallax } from 'react-parallax';

export default function Header() {
  const downloadAppMobile = () => {
    alert("Download App");
  };
  const clipPath = {
    clipPath:
      "polygon(0 0, 100% 0, 100% 90%, 90% 100%, 80% 90%, 75% 100%, 73% 95%, 70% 100%, 60% 90%, 50% 100%, 40% 90%, 37% 100%, 20% 95%, 10% 100%, 8% 96%,0 100%)",
  };
  return (
    <div
      id="Home"
      className="relative flex flex-col h-[50vh] bg-gradient-to-b from-Tertiary-60 to-Primary-60"
      style={clipPath}
    >
      <section id="hero" className="flex justify-between h-full w-full">
        <div className="flex flex-col justify-center w-full pl-40 gap-12">
          <div>
            <h1 className="text-5xl font-bold text-white ">BIMBEL LINEAR</h1>
            <p className="text-white ">Solusi Pintar Teman Belajar</p>
          </div>
          <Button
            brColor=""
            textColor="text-Primary-20"
            type="button"
            withBgColor
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
