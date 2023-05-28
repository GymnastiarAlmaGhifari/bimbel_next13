import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Riwayat = () => {
  useEffect(() => {
    document.title = "Bimbel Linear";
  });
  return (
    <div>
      <h1>Riwayat</h1>
      <Sidebar />
    </div>
  );
};

export default Riwayat;
