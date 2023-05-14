"use client";

import Image from "next/image";
import { IoIosArrowDown, IoMdArrowDown } from "react-icons/io";
import { MdArrowBack } from "react-icons/md";

const Navbar = () => {
  return (
    <div className="bg-Neutral-100 h-14 flex items-center justify-end px-24 py-2">
      <div className="flex items-center inline-block gap-4">
        <div className="inline-block">
          <p className="font-bold">Agimul Karim</p>
          <p className="font-semibold text-sm">Super Admin</p>
        </div>
        <div className="w-10 h-10 rounded-full overflow-clip scale-100 bg-red-400">
          <Image
            src="https://img.jakpost.net/c/2017/02/15/2017_02_15_21637_1487139254._large.jpg"
            alt="Profile" width={40} height={40} className="rounded-full w-full h-full object-cover"
          />
        </div>
        <IoIosArrowDown/>
      </div>
    </div>
  );
};

export default Navbar;
