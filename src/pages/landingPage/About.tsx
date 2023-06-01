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
    <div id="About" className="flex h-screen  px-16 pt-14 gap-5">
      <div className="flex flex-col w-full gap-14">
        <div className="pr-14">
          <h2 className="mb-2 text-3xl font-bold">Tentang Kami</h2>
          <p className="">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id laborum voluptates saepe obcaecati dolorem adipisci nobis corporis minima nemo? Tenetur quam deserunt possimus facilis consequatur dolorum ipsam quae, maxime aliquam
            omnis non aut reprehenderit fuga rem nulla neque delectus assumenda doloremque? Laudantium iure nulla amet expedita eveniet reprehenderit quae perspiciatis.
          </p>
        </div>
        <div>
          <h3 className="mb-4">Sosial Media Kami: </h3>
          <ListButtonSosialMedia />
        </div>
      </div>
      <div className="w-full flex flex-col gap-8">
        <h2 className="text-3xl font-bold ">Profile Tentor</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* map data dari users hanya 6 saja */}
          {users?.map((user: any, index: any) => {
            if (index < 6) {
              return <Tentor key={index} wAuto
                nama={user?.name}
                institut={user?.universitas}
                mataPelajaran={user.mapel?.nama_mapel}
                profile={user?.image} />;
            }
          })}
        </div>
        <Link href="/landingPage/DetailAboutUs">Lihat Selengkapnya</Link>
      </div>
    </div>
  );
}
