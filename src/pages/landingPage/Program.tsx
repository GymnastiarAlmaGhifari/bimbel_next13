import { Inter } from "next/font/google";
import ItemProgram from "@/pages/components/landingPage/ItemProgram";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";

interface Program {
  kelas: any;
  id: string;
  nama_program: string;
  level: string;
  tipe: string;
  Deskripsi: string;
  harga: number;
  img: string;
  nama_kelas: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Program() {
  const { data: program, error } = useSWR<Program[]>(
    "/api/program",
    fetcher,
    {}
  );
  return (
    <div
      id="Program"
      className=" flex flex-col pt-14 content-center bg-gradient-to-b from-Tertiary-60 to-Primary-60"
    >
      <h2 className="text-center font-bold text-white text-3xl mb-9">
        Program
      </h2>
      <div className="h-full w-full">
        <div className="px-36 pb-36 grid grid-cols-3 gap-4">
          {
            program?.map((item) =>
              <ItemProgram
                key={item.id}
                nama_program={item.nama_program}
                nama_kelas={item.kelas.nama_kelas}
                deskripsi={item.Deskripsi}
                gambar={item.img}
                harga={item.harga}
                level={item.level}
                tipe={item.tipe}
              />
            )
          }


        </div>
      </div>
    </div>
  );
}
