import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

const NavbarPengaturan = (props: Props) => {
  const router = useRouter();
  return (
    <ul className="flex gap-4">
      <li>
        <Link href="/pengaturan/program">
          <button
            className={`${
              router.pathname === "/pengaturan/program"
                ? "bg-Primary-20 text-Primary-90 font-bold py-2 px-4 rounded-lg "
                : "bg-Neutral-95 text-Primary-20 font-bold py-2 px-4 rounded-lg hover:bg-Primary-95 hover:border-Primary-50"
            }`}
          >
            Program
          </button>
        </Link>
      </li>
      <li>
        <Link href="/pengaturan/ruang">
          <button
            className={`${
              router.pathname === "/pengaturan/ruang"
                ? "bg-Primary-20 text-Primary-90 font-bold py-2 px-4 rounded-lg "
                : "bg-Neutral-95 text-Primary-20 font-bold py-2 px-4 rounded-lg hover:bg-Primary-95 hover:border-Primary-50"
            }`}
          >
            Ruang
          </button>
        </Link>
      </li>
      <li>
        <Link href="/pengaturan/sesi">
          <button
            className={`${
              router.pathname === "/pengaturan/sesi"
                ? "bg-Primary-20 text-Primary-90 font-bold py-2 px-4 rounded-lg "
                : "bg-Neutral-95 text-Primary-20 font-bold py-2 px-4 rounded-lg hover:bg-Primary-95 hover:border-Primary-50"
            }`}
          >
            Sesi
          </button>
        </Link>
      </li>
      <li>
        <Link href="/pengaturan/mapel">
          <button
            className={`${
              router.pathname === "/pengaturan/mapel"
                ? "bg-Primary-20 text-Primary-90 font-bold py-2 px-4 rounded-lg "
                : "bg-Neutral-95 text-Primary-20 font-bold py-2 px-4 rounded-lg hover:bg-Primary-95 hover:border-Primary-50"
            }`}
          >
            Mapel
          </button>
        </Link>
      </li>
      <li>
        <Link href="/pengaturan/kelas">
          <button
            className={`${
              router.pathname === "/pengaturan/kelas"
                ? "bg-Primary-20 text-Primary-90 font-bold py-2 px-4 rounded-lg "
                : "bg-Neutral-95 text-Primary-20 font-bold py-2 px-4 rounded-lg hover:bg-Primary-95 hover:border-Primary-50"
            }`}
          >
            Kelas
          </button>
        </Link>
      </li>

      <li>
        <Link href="/pengaturan/gaji">
          <button
            className={`${
              router.pathname === "/pengaturan/gaji"
                ? "bg-Primary-20 text-Primary-90 font-bold py-2 px-4 rounded-lg "
                : "bg-Neutral-95 text-Primary-20 font-bold py-2 px-4 rounded-lg hover:bg-Primary-95 hover:border-Primary-50"
            }`}
          >
            Gaji
          </button>
        </Link>
      </li>
    </ul>
  );
};

export default NavbarPengaturan;