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
import useSWR, { mutate } from "swr";
import fetcher from "@/libs/fetcher";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, status } = useSession();

  //simpan ke variable session id to use in fetcher
  const sessionId = session?.user.id;

  const { data: users, error } = useSWR(`/api/user/${sessionId}`, fetcher, {});

  mutate(`/api/user/${sessionId}`);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const pindahProfil = () => {
    window.location.href = "/profile";
  };

  return (
    <div className="bg-Neutral-100 h-14 flex items-center justify-end px-4 py-2 z-40">
      <button onClick={toggleMenu} className="relative">
        <div className="flex items-center inline-block gap-2">
          <div className="inline-block pr-2 flex flex-col">
            <p className="font-bold text-left">{users?.name}</p>

            <p className="font-semibold text-ms text-left">{users?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-clip scale-100 border-[1px] border-Primary-50">
            <Image
              src={"/api/user/img?img=" + users?.image ? "/api/user/img?img=" + users?.image : "/img/user/default.png"}
              alt="Megachan"
              width={100}
              height={100}
              className="rounded-full w-full h-full object-cover"
              loader={({ src }) => `${src}?cache-control=no-store`}
            />
          </div>
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
        {isOpen ? (
          <div className="absolute right-0 mt-1 flex flex-col bg-Neutral-100 py-2 px-4 rounded-lg border-[1px] border-Neutral-90 gap-2">
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
                  () =>
                    signOut({
                      callbackUrl: "/",
                    })
                }
              />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </button>
    </div>
  );
};

export default Navbar;
