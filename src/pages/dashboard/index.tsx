import { GetServerSideProps } from "next";
import prisma from "@/libs/prismadb";
import Link from "next/link";
import { useRouter } from "next/router";
import HeadTable from "../components/HeadTable";
import CardExample from "@/pages/components/cardExample";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { signOut } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ModalDetail } from "@/pages/components/Modal";
import BookEdit from "./edit/index";
import fetcher from "@/libs/fetcher";
import UserCard from "../components/card/CardPengguna";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  books: Book[];
}

const Dashboard: React.FC<Props> = ({ books }) => {
  const router = useRouter();
  const backDashboard = () => {
    router.push("/dashboard");
  };
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />

      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-10 bg-Neutral-95 ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg">
            <HeadTable label="Overview Jadwal" />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg"></div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
