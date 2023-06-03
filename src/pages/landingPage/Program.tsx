import { Inter } from "next/font/google";
import ItemProgram from "@/pages/components/landingPage/ItemProgram";
import Image from "next/image";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Keyboard, Scrollbar, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
      className="flex flex-col pt-14 content-center bg-gradient-to-b from-Tertiary-60 to-Primary-60 relative z-0 pb-24"
    >
      <h2 className="text-center font-bold text-white text-3xl mb-9">
        Program
      </h2>
      <div className="h-full w-full px-20">
        <Swiper slidesPerView={3} navigation={true} spaceBetween={40} modules={[Navigation]}>
          {program?.map((item) => (
            // eslint-disable-next-line react/jsx-key
            <SwiperSlide>
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
            </SwiperSlide>
          ))}
        </Swiper>

        {/* <div className="px-36 pb-36 grid grid-rows-2 grid-flow-col gap-4">
          {program?.map((item) => (
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
          ))}
        </div> */}
      </div>
      {/* <div className="absolute w-full h-full z-[-2]">
        <Image
          alt=""
          src={"/shape1_program.svg"}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute w-full h-full z-[-1]">
        <Image
          alt=""
          src={"/shape2_program.svg"}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </div> */}
    </div>
  );
}
