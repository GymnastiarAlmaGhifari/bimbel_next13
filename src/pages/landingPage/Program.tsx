import { Inter } from "next/font/google";
import ItemProgram from "@/pages/components/landingPage/ItemProgram";
import Image from "next/image";

export default function Program() {
  return (
    <div
      id="Program"
      className=" flex flex-col pt-14 content-center bg-gradient-to-b from-Tertiary-60 to-Primary-60 relative z-0"
    >
      <h2 className="text-center font-bold text-white text-3xl mb-9">
        Program
      </h2>
      <div className="h-full w-full">
        <div className="px-36 pb-36 grid grid-cols-3 gap-4">
          <ItemProgram />
          <ItemProgram />
          <ItemProgram />
          <ItemProgram />
          <ItemProgram />
          <ItemProgram />
        </div>
      </div>
      <div className="absolute w-full h-full z-[-2]">
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
      </div>
    </div>
  );
}
