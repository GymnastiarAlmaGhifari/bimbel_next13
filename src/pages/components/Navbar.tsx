"use client";

import Image from "next/image";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdArrowBack, MdOutlineKey, MdOutlineLogout } from "react-icons/md";
import Button from "./buttons/Button";
import Link from "next/link";
import { BsPersonFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const pindahProfil = () => {
    window.location.href = "/profile";
  };

  return (
    <div className="bg-Neutral-100 h-14 flex items-center justify-end px-4 py-2 z-40">
      <div className="relative">
        <div className="flex items-center inline-block gap-4">
          <div className="inline-block">
            <p className="font-bold">{session?.user.name}</p>

            <p className="font-semibold text-sm">{session?.user.role}</p>

          </div>
          <div className="w-10 h-10 rounded-full overflow-clip scale-100 bg-red-400">
            <Image
              src={session?.user?.image ? session.user.image : "/img/user/default.png"}
              alt="Megachan"
              width={100}
              height={100}
              className="rounded-full w-full h-full object-cover"
              loader={({ src }) => `${src}?cache-control=no-store`}
            />
          </div>
          <button onClick={toggleMenu}>
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        </div>
        {isOpen ? (
          <div className="absolute mt-1 flex flex-col bg-Neutral-100 py-2 px-4 rounded-lg border-[1px] translate-x-[-25px] border-Neutral-90 gap-2">
            {isOpen ? (
              <Button
                bgColor="bg-Primary-50"
                label="Profile"
                widthAuto
                brColor=""
                textColor="text-Primary-10"
                type="button"
                onClick={pindahProfil}
                icon={BsPersonFill}
              />
            ) : (
              ""
            )}
            {isOpen ? (
              <Button
                bgColor="bg-Primary-50"
                label="Ubah Password"
                brColor=""
                textColor="text-Primary-10"
                type="button"
                icon={MdOutlineKey}
              />
            ) : (
              ""
            )}
            {isOpen ? (
              <Button
                bgColor="bg-Primary-50"
                label="Logout"
                brColor=""
                textColor="text-Primary-10"
                widthAuto
                type="button"
                icon={MdOutlineLogout}
                onClick={
                  // callback ke / 
                  () => signOut(
                    {
                      callbackUrl: "/",
                    }

                  )
                }

              />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Navbar;
