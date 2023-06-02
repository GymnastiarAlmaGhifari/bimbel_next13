import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

const NavbarPembayaran = (props: Props) => {
  const router = useRouter();
  return (
    <ul className="flex gap-4">
      <li>
        <Link href="/pembayaran/tagihan">
          <button
            className={`${router.pathname === "/pembayaran/tagihan"
              ? "bg-Primary-20 text-Primary-90 font-bold py-2 px-4 rounded-lg "
              : "bg-Neutral-95 text-Primary-20 font-bold py-2 px-4 rounded-lg hover:bg-Primary-95 hover:border-Primary-50"
              }`}
          >
            Tagihan
          </button>
        </Link>
      </li>
      {/* <li>
        <Link href="/pembayaran/gaji">
          <button
            className={`${router.pathname === "/pembayaran/gaji"
              ? "bg-Primary-20 text-Primary-90 font-bold py-2 px-4 rounded-lg "
              : "bg-Neutral-95 text-Primary-20 font-bold py-2 px-4 rounded-lg hover:bg-Primary-95 hover:border-Primary-50"
              }`}
          >
            Gaji
          </button>
        </Link>
      </li> */}
    </ul>
  );
};

export default NavbarPembayaran;
