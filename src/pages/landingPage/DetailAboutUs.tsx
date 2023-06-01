import { Inter } from "next/font/google";
import Tentor from "../components/landingPage/Tentor";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import Image from "next/image";

export default function DetailAboutUs() {
  const { data: users, error } = useSWR(`/api/user`, fetcher, {});

  return (
    <div className="flex flex-col pt-14 h-screen relative">
      <div className="absolute">
        <Link href="/">
          <IoIosArrowBack size={48} />
        </Link>
      </div>
      <h1 className="mb-2 text-3xl font-bold text-center mb-9">
        Profile Tentor Kami
      </h1>
      <div className="grid grid-cols-4 self-center  h-auto gap-4">
        {users?.map((user: any, index: any) => {
          return (
            <Tentor
              key={index}
              nama={user?.name}
              institut={user?.universitas}
              mataPelajaran={user.mapel?.nama_mapel}
              profile={user?.image}
            />
          );
        })}
      </div>
      <div className="w-full h-full z-[-1]">
        <Image
          alt=""
          src={"/illustration1_detailtentor.svg"}
          width={500}
          height={500}
          className=" object-cover absolute bottom-0 left-0"
        />
      </div>
      <div className="w-full h-full z-[-3]">
        <Image
          alt=""
          src={"/illustration2_detailtentor.svg"}
          width={500}
          height={500}
          className=" object-cover absolute bottom-0 right-0"
        />
      </div>
      <div className="w-full h-full z-[-2]">
        <Image
          alt=""
          src={"/blob1_detailtentor.svg"}
          width={500}
          height={500}
          className=" object-cover absolute bottom-0 left-0"
        />
      </div>
      <div className="w-full h-full z-[-4]">
        <Image
          alt=""
          src={"/blob2_detailtentor.svg"}
          width={500}
          height={500}
          className=" object-cover absolute bottom-0 right-0"
        />
      </div>
    </div>
  );
}
