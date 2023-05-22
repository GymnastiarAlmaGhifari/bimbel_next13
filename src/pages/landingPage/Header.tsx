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
      className="relative flex flex-col h-[50vh] bg-gradient-to-b from-Tertiary-40 to-Primary-50"
    >
      {/* <svg width={"100%"} height={"100px"} className=" absolute bottom-0 translate-y-[60px]">
        <path d="M100,40 L150,90 L200,60 400,80 500,40 z" fill="#7fe9de" />
        <path d="M900,40 950,0 1000,40 1200,0 1250,40 z " fill="#ffffff" />
      </svg> */}
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
