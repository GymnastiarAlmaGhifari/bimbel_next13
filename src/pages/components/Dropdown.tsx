"use client";

import { useState } from "react";

const Dropdown = () => {
  const [label, setlabel] = useState("");
  const [aktif, setaktif] = useState(false);
  const dropdownAktif = () => {
    setaktif(!aktif);
  };
  return (
    <div className="flex flex-col">
      <div className="py-2 bg-red-500 w-max" onClick={dropdownAktif}>Dropdown</div>
      {/* {aktif ? <><div className=""></div></>} */}
    </div>
  );
};

export default Dropdown;
