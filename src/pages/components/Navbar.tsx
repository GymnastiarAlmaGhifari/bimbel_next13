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
        <div className="w-10 h-10 rounded-full overflow-clip">
          <Image
            src="https://th.bing.com/th/id/OIP.jUTdbKVku8FQ84w4R169wAHaGN?pid=ImgDet&rs=1"
            alt="Profile" width={100} height={100}
          />
        </div>
        <IoIosArrowDown/>
      </div>
    </div>
  );
};

export default Navbar;
