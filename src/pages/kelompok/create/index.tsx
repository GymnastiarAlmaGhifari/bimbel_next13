import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { FC } from "react";


interface Kelompok {
  program: any;
  jadwal: any;
  id: string;
  nama_kelompok: string;
  jadwal_id: string;
  program_id: string;
  tipe: string;
  level: string;
  createdAt: Date;
  updatedAt: Date;
}

const Kelompok: FC<Kelompok> = () => {


  return (

  <h1>
    halo
  </h1>
    )
  }
export default Kelompok;
