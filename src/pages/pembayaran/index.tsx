import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HeadTable from "../components/HeadTable";
import Navbar from "../components/Navbar";
import CardPembayaran from "../components/card/CardPembayaranTagihan";
import { useSession } from "next-auth/react";

const Pembayaran = () => {

  const session = useSession();

  // useEffect if session is alredy exist redirect to /pembayaran/tagihan if session is null then redirect to /
  useEffect(() => {
    if (session.data) {
      window.location.href = "/pembayaran/tagihan";
    } else {
      window.location.href = "/";
    }
  }
  );
  return (
    <>
    </>
  );
};

export default Pembayaran;