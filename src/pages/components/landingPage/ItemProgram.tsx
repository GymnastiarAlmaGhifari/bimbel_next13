import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

export default function ItemProgram() {
  return (
    <div className="bg-Neutral-100 rounded-lg pb-3 h-auto overflow-hidden w-full ">
      <div className="relative">
        <Image
          className="w-full"
          src="imgProgram.svg"
          alt="gambar program"
          width={500}
          height={500}
        />
        <span className="text-3xl font-bold text-Primary-10 absolute top-2 left-2">
          Tingkatan
        </span>
      </div>
      <div className="px-4 pt-2">
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ex
          molestiae esse quisquam illum excepturi nulla, minima libero iste
          quis!
        </p>
        <div className="flex justify-end">
          <Link
            href={"/landingPage/DetailProgram"}
            className="text-xs flex items-center"
          >
            Lihat Detail <IoIosArrowForward />
          </Link>
          {/* <a href="" className="text-xs">
            Lihat Detail
          </a> */}
        </div>
      </div>
    </div>
  );
}
