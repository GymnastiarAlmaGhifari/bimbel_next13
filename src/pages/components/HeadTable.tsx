"use client";
import { MdOutlineSort } from "react-icons/md";
import Search from "./Search";

export default function HeadTable() {
  return (
    <div className="bg-Neutral-100 flex flex-row items-center h-[72px] px-5">
      <div className="flex flex-row items-center gap-14 w-full">
        <h2 className="text-xl font-semibold text-Primary-10">Label</h2>
        <div className="flex flex-row items-center gap-4">
          <Search />
          <button className="flex gap-1">
            <MdOutlineSort size={24} />{" "}
            <span className="text-sm font-bold text-Neutral-20">Filter</span>
          </button>
        </div>
      </div>
      <button>Tambah</button>
    </div>
  );
}
