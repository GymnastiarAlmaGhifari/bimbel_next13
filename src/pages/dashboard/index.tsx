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
  useEffect(() => {
    document.title = "Bimbel Linear";
  });

  const session = useSession();

  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);


  const {
    data: dashboard,
    error,
    isLoading,
  } = useSWR(
    `/api/dashboard?role=${session.data?.user.role}&user_id=${session.data?.user.id}`,
    fetcher,
    {}
  );

  let filteredDashboard = null;

  if (Array.isArray(dashboard)) {
    // Filter the jadwal array for each item in the dashboard array
    filteredDashboard = dashboard.map((item: any) => ({
      ...item,
      jadwal: item.jadwal.filter((jadwal: any) =>
        jadwal.kelompok.nama_kelompok
          .toLowerCase()
          .includes(debouncedValue.toLowerCase())
      ),
    }));
  } else if (dashboard && dashboard.jadwal) {
    // Filter the jadwal array directly when dashboard is an object
    filteredDashboard = {
      ...dashboard,
      jadwal: dashboard.jadwal.filter((jadwal: any) =>
        jadwal.kelompok.nama_kelompok
          .toLowerCase()
          .includes(debouncedValue.toLowerCase())
      ),
    };
  }


  const handleInputChange = (value: string) => {
    setInputValue(value);
  };



  return (
    <div className="flex flex-row h-full w-full font-mulish">
      <Sidebar />

      <div className="w-full h-screen flex flex-col ">
        <Navbar />
        <div className="flex flex-col gap-2 h-full p-5 bg-Neutral-95 overflow-auto">
          <InfoDashboard
            tentor={
              isLoading ? (
                <div className="animate-pulse h-10 w-10 bg-Neutral-100 rounded-full">
                  loading
                </div>
              ) : (
                dashboard?.total_tentor
              )
            }
            siswa={
              isLoading ? (
                <div className="animate-pulse h-10 w-10 bg-Neutral-100 rounded-full">
                  loading
                </div>
              ) : (
                dashboard?.total_siswa
              )
            }
            dana={
              isLoading ? (
                <div className="animate-pulse h-10 w-10 bg-Neutral-100 rounded-full">
                  loading
                </div>
              ) : (
                dashboard?.total_tagihan._sum.jumlah_tagihan
              )
            }
          />
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg overflow-auto">
            <HeadTable noAdd label="Overview Jadwal"

              onChange={handleInputChange}
            />
            <div className="flex flex-col scrollbar rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto h-full ">
              {/* maping dashboard */}

              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-Primary-100"></div>
                  <p className="text-Primary-100">Loading...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredDashboard?.jadwal.map((item: any) => (
                    <CardDashboard
                      key={item.id}
                      nama_kelompok={item.kelompok.nama_kelompok}
                      nama_mapel={item.mapel.nama_mapel}
                      nama_tentor={item.user.name}
                      nama_sesi={item.sesi.nama_sesi}
                      nama_program={item.kelompok.program.nama_program}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
