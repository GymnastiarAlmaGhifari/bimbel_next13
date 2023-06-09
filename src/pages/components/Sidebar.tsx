"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { AiFillHome, AiOutlineClose } from "react-icons/ai";
import { BsFillPersonFill, BsCalendar } from "react-icons/bs";
import { MdPayment, MdPeopleAlt, MdLocalLibrary } from "react-icons/md";
import { IoMdSchool, IoMdSettings } from "react-icons/io";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Sidebar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const baseStyleButtonSideBar =
    "h-14 px-3 flex flex-row gap-3 bg-Neutral-100 items-center text-Primary-10 font-bold rounded-lg";
  const activeStyleButtonSideBar =
    "text-Primary-90 bg-Primary-20 hover:bg-Primary-20 cursor-auto";


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [isOpen, setIsOpen] = useState(false);

  // @ts-ignore
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const sidebarCollapsed = localStorage.getItem("sidebarCollapsed");
      setIsOpen(sidebarCollapsed === "true");
    }
  }, []);

  const toggleMenu = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", newIsOpen.toString());
    }
  };

  return (
    <>
      <div className={`${isOpen ? "w-64" : "w-24"} group h-full z-50 relative`}>
        <div className="h-14 flex pl-4 py-1 justify-between items-center gap-1 ">
          <div className="w-full py-2">
            <Image
              src={isOpen ? "/LogoSidebarOpen.svg" : "/LogoSidebarClose.svg"}
              alt="Logo"
              width={500}
              height={500}
              className="bg-cover"
            />
          </div>
          <button
            onClick={toggleMenu}
            className="rounded-l-full pl-1 text-Neutral-100 bg-gradient-to-b from-Tertiary-60 to-Primary-60 "
          >
            {isOpen ? (
              <AiOutlineClose size={24} />
            ) : (
              <HiOutlineMenuAlt4 size={24} />
            )}
          </button>
        </div>

        <nav className={`${isOpen ? "" : ""}  px-4 pt-5`}>
          <ul className="flex flex-col gap-3">
            {session?.user.role === "TENTOR" ? (
              <>
                <li>
                  <Link href="/dashboard">
                    <button
                      className={`${router.pathname === "/dashboard"
                        ? activeStyleButtonSideBar
                        : "hover:bg-Primary-90"
                        } ${baseStyleButtonSideBar} ${isOpen ? "w-full" : "w-14 justify-center"
                        }`}
                    >
                      <div>
                        <AiFillHome size={24} />
                      </div>
                      {isOpen ? "Home" : ""}
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/modul">
                    <button
                      className={`${router.pathname === "/modul"
                        ? activeStyleButtonSideBar
                        : "hover:bg-Primary-90"
                        } ${baseStyleButtonSideBar} ${isOpen ? "w-full" : "w-14 justify-center"
                        }`}
                    >
                      <div>
                        <MdLocalLibrary size={24} />
                      </div>
                      {isOpen ? "Modul" : ""}
                    </button>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/dashboard">
                    <button
                      className={`${router.pathname === "/dashboard"
                        ? activeStyleButtonSideBar
                        : "hover:bg-Primary-90"
                        } ${baseStyleButtonSideBar} ${isOpen ? "w-full" : "w-14 justify-center"
                        }`}
                    >
                      <div className="">
                        <AiFillHome size={24} />
                      </div>
                      {isOpen ? "Home" : ""}
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/jadwal">
                    <button
                      className={`${router.pathname === "/jadwal"
                        ? activeStyleButtonSideBar
                        : "hover:bg-Primary-90"
                        } ${baseStyleButtonSideBar} ${isOpen ? "w-full" : "w-14 justify-center"
                        }`}
                    >
                      <div>
                        <BsCalendar size={24} />
                      </div>
                      {isOpen ? "Jadwal" : ""}
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/pengguna">
                    <button
                      className={`${router.pathname === "/pengguna"
                        ? activeStyleButtonSideBar
                        : "hover:bg-Primary-90"
                        } ${baseStyleButtonSideBar} ${isOpen ? "w-full" : "w-14 justify-center"
                        }`}
                    >
                      <div>
                        <BsFillPersonFill size={24} />
                      </div>
                      {isOpen ? "User" : ""}
                    </button>
                  </Link>
                </li>
                {
                  session?.user.role === "ADMIN" ? (
                    <>
                    </>
                  ) : (
                    <li>
                      <Link href="/pembayaran/tagihan">
                        <button
                          className={`${router.pathname === "/pembayaran/gaji" ||
                            router.pathname === "/pembayaran/tagihan" ||
                            router.pathname === "/pembayaran/riwayatPembayaran"
                            ? activeStyleButtonSideBar
                            : "hover:bg-Primary-90"
                            } ${baseStyleButtonSideBar} ${isOpen ? "w-full" : "w-14 justify-center"
                            }`}
                        >
                          <div>
                            <MdPayment size={24} />
                          </div>
                          {isOpen ? "Pembayaran" : ""}
                        </button>
                      </Link>
                    </li>
                  )
                }
                <li>
                  <Link href="/siswa">
                    <button
                      className={`${router.pathname === "/siswa"
                        ? activeStyleButtonSideBar
                        : "hover:bg-Primary-90"
                        } ${baseStyleButtonSideBar} ${isOpen ? "w-full" : "w-14 justify-center"
                        }`}
                    >
                      <div>
                        <IoMdSchool size={24} />
                      </div>
                      {isOpen ? "Siswa" : ""}
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/kelompok">
                    <button
                      className={`${router.pathname === "/kelompok"
                        ? activeStyleButtonSideBar
                        : "hover:bg-Primary-90"
                        } ${baseStyleButtonSideBar} ${isOpen ? "w-full" : "w-14 justify-center"
                        }`}
                    >
                      <div>
                        <MdPeopleAlt size={24} />
                      </div>
                      {isOpen ? "Kelompok" : ""}
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/modul">
                    <button
                      className={`${router.pathname === "/modul"
                        ? activeStyleButtonSideBar
                        : "hover:bg-Primary-90"
                        } ${baseStyleButtonSideBar} ${isOpen ? "w-full" : "w-14 justify-center"
                        }`}
                    >
                      <div>
                        <MdLocalLibrary size={24} />
                      </div>
                      {isOpen ? "Modul" : ""}
                    </button>
                  </Link>
                </li>
                {
                  session?.user.role === "ADMIN" ? (
                    <>
                    </>
                  ) : (
                    <li>
                      <Link href="/pengaturan/program">
                        <button
                          className={
                            // buatkan ketika menyala berada di pengaturan/prgram, pengaturan/module, dan pengaturan/sesi
                            `${router.pathname === "/pengaturan/program" ||
                              router.pathname === "/pengaturan/ruang" ||
                              router.pathname === "/pengaturan/sesi" ||
                              router.pathname === "/pengaturan/mapel" ||
                              router.pathname === "/pengaturan/kelas" ||
                              router.pathname === "/pengaturan/gaji" ||
                              router.pathname === "/pengaturan/diskon"
                              ? activeStyleButtonSideBar
                              : "hover:bg-Primary-90"
                            } ${baseStyleButtonSideBar} ${isOpen ? "w-full" : "w-14 justify-center"
                            }`
                          }
                        >
                          <div>
                            <IoMdSettings size={24} />
                          </div>
                          {isOpen ? "Pengaturan" : ""}
                        </button>
                      </Link>
                    </li>
                  )
                }
              </>
            )

            }

          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
