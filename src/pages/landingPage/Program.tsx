import { Inter } from "next/font/google";
import ItemProgram from "@/pages/components/landingPage/ItemProgram";

export default function Program() {
  return (
    <div
      id="Program"
      className=" flex flex-col pt-14 content-center bg-gradient-to-b from-Tertiary-50 to-Primary-60"
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
    </div>
  );
}
