import Link from "next/link";
import React from "react";
import { GetServerSideProps } from "next";
import prisma from "@/libs/prismadb";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeadTable from "../components/HeadTable";
import GroupCard from "../components/card/CardKelompok";
import CardKelompok from "../components/card/CardKelompok";

interface Kelompok {
  program: any;
  jadwal: any;
  id: string;
  nama_kelompok: string;
  nama_program: string;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  kelompok: Kelompok[];
}

const Kelompok: React.FC<Props> = ({ kelompok }) => {
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="h-full p-10 bg-Neutral-95">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg">
            <HeadTable label="Kelompok" />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
              <CardKelompok nama="Agimul Karim" nama_kelompok="6A" nama_program="Private"/>
                  {kelompok.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nama_kelompok}</td>
                      <td>{item.program.nama_program}</td>
                      <td>{item.jadwal.nama}</td>
                      <td>{item.createdAt.toString()}</td>
                      <td>{item.updatedAt.toString()}</td>
                      <td>
                        <Link href={`/pengaturan/kelompok/edit/${item.id}`}>
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            edit
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
              {/* <Link href="/kelompok">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          kembali
        </button>
      </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // buatjoin dari table kelompok dan kelas
  const kelompok = await prisma.kelompok.findMany({
    select: {
      id: true,
      nama_kelompok: true,
      program: {
        select: {
          nama_program: true,
        },
      },
      jadwal: {
        select: {
          nama: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  const serializedMapel = kelompok.map((item) => ({
    ...item,
    createdAt: item.createdAt.toString(),
    updatedAt: item.updatedAt.toString(),
  }));

  return {
    props: {
      kelompok: serializedMapel,
    },
  };
};

export default Kelompok;
