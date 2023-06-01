import { Inter } from "next/font/google";
import Tentor from "../components/landingPage/Tentor";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";

export default function DetailAboutUs() {
  const { data: users, error } = useSWR(`/api/user`, fetcher, {});

  return (
    <div className="flex flex-col pt-14 h-screen">
      <div className="absolute">
        <Link href="/">
          <IoIosArrowBack size={48} />
        </Link>
      </div>
      <h1 className="mb-2 text-3xl font-bold text-center mb-9">Profile Tentor Kami</h1>
      <div className="grid grid-cols-4 self-center  h-auto gap-4">
        {users?.map((user: any, index: any) => {
          return <Tentor key={index}
            nama={user?.name}
            institut={user?.universitas}
            mataPelajaran={user.mapel?.nama_mapel}
            profile={user?.image} />;
        })}
      </div>
    </div>
  );
}
