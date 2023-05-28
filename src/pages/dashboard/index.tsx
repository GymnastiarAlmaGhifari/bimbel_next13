import { GetServerSideProps } from "next";
import prisma from "@/libs/prismadb";
import Link from "next/link";
import { useRouter } from "next/router";
import HeadTable from "../components/HeadTable";
import { FC, useEffect, useState } from "react";
import useSWR from "swr";
import { signOut, useSession } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ModalDetail } from "@/pages/components/modal/Modal";
import fetcher from "@/libs/fetcher";
import UserCard from "../components/card/CardPengguna";
import InfoDashboard from "../components/InfoDashboard";
import CardDashboard from "../components/card/CardDashboard";


const Dashboard = () => {

  const session = useSession();

  const { data: dashboard, error } = useSWR(`/api/dashboard?role=${session.data?.user.role}&user_id=${session.data?.user.id}`, fetcher, {});
  const router = useRouter();
  const backDashboard = () => {
    router.push("/dashboard");
  };
  return (
    <div className="flex flex-row h-full w-full font-mulish" >
      <Sidebar />

      <div className="w-full h-screen flex flex-col ">
        <Navbar />
        <div className="flex flex-col gap-2 h-full p-5 bg-Neutral-95 overflow-auto">
          <InfoDashboard
            tentor={dashboard?.total_tentor}
            siswa={dashboard?.total_siswa}
            dana={dashboard?.total_tagihan._sum.jumlah_tagihan}
          />
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable label="Overview Jadwal" />
            <div className="flex flex-col scrollbar rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto h-full ">
              <CardDashboard />
              <CardDashboard />
              <CardDashboard />
            </div>
          </div>{" "}
        </div>
      </div>
    </div >
  );
};

export default Dashboard;
