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
    clipPath: "polygon(0 0, 100% 0, 100% 80%, 80% 100%, 20% 90%, 0 100%)",
  };
  return (
    <div
      id="Home"
      className="relative flex flex-col h-[50vh] bg-gradient-to-b from-Tertiary-40 to-Primary-50"
      style={clipPath}
    >
      <svg width={300} height={300} className="absolute bottom-0 bg-Primary-20 z-[-1]">
        <circle cy={50} cx={50} r={50} fill="red"/>
      </svg>
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
