"use client";

import { Inter } from "next/font/google";
import Button from "@/pages/components/buttons/Button";
import Tentor from "@/pages/components/landingPage/Tentor";
import ButtonInAbout from "@/pages/components/buttons/ButtonInAbout";
// import { Link } from "react-router-dom";
import { IoLogoWhatsapp } from "react-icons/io";
import { useState } from "react";
import ListButtonSosialMedia from "../components/landingPage/ListButtonSosialMedia";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
export default function AboutUs() {
  const router = useRouter();
  const toDetailAboutUs = () => {
    router.push("");
  };

  const { data: users, error } = useSWR(`/api/user`, fetcher, {});

  return (
    <div
      id="About"
      className="flex flex-col h-max px-16 py-24 gap-28 items-center"
    >
      <div className="flex flex-col gap-8l w-3/4">
        <h2 className="mb-2 text-3xl font-bold text-center">Tentang Kami</h2>
        <p className="text-center">
          Bimbel Linear adalah aplikasi bimbingan belajar yang berlokasi di
          Kabupaten Solo dan telah berdiri selama 5 tahun. Kami menyediakan
          program bimbingan belajar untuk siswa dari tingkat SD sampai SMA.
          Dengan tim tentor berkualitas dan berpengalaman, kami berkomitmen
          untuk memberikan layanan yang terbaik kepada siswa. Program kami
          dirancang untuk memahami konsep, penguasaan teknik, dan pengembangan
          kemampuan berpikir kritis dan kreatif. <br />
          <br />
          Di Bimbel Linear, kami mengutamakan pembelajaran interaktif dan
          melibatkan siswa secara aktif. Melalui penggunaan teknologi terkini
          dan metode pembelajaran inovatif, kami membantu siswa meningkatkan
          pemahaman dan keterampilan mereka. Selain itu, kami juga menyediakan
          layanan bimbingan karir untuk membantu siswa mempersiapkan diri dalam
          mencapai kesuksesan di masa depan.
          <br />
          <br /> Kami berkomitmen untuk memberikan pengalaman belajar terbaik
          kepada siswa dan terus meningkatkan kualitas layanan kami.
          Bergabunglah dengan Bimbel Linear sekarang dan temukan lingkungan
          belajar yang mendukung, inspiratif, dan penuh prestasi!
        </p>
        <div className="flex flex-col items-center gap-2 mt-12">
          <h3 className="font-semibold">Sosial Media Kami: </h3>
          <ListButtonSosialMedia />
        </div>
      </div>
      <div className="w-full h-full flex items-center flex-col gap-8 px-8">
        <h2 className="text-3xl font-bold ">Profile Tentor</h2>
        <div className="grid grid-cols-5 gap-6 w-full">
          {/* map data dari users hanya 6 saja */}
          {users?.map((user: any, index: any) => {
            if (index < 10) {
              return (
                <Tentor
                  wAuto
                  key={index}
                  nama={user?.name}
                  institut={user?.universitas}
                  mataPelajaran={user.mapel?.nama_mapel}
                  profile={user?.image}
                />
              );
            }
          })}
        </div>
        <div className="flex justify-end w-full">
          <Link href="/landingPage/DetailAboutUs">Lihat Selengkapnya</Link>
        </div>
      </div>
    </div>
  );
}
