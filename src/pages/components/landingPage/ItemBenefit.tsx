import { Inter } from "next/font/google";

import Image from 'next/image'

export default function ItemBenefit() {
  return (
    <div className="h-64 w-64 bg-white relative rounded shadow-[4px_4px_0px_0px_rgba(101,186,177,0.3)]">
      <Image  src="imgProgram.svg" alt="" width={500} height={500} className="absolute w-full"/>
      <p className="absolute text-lg bottom-0 left-2 font-bold text-Primary-10">Keterangan Benefit</p>
    </div>
  );
}
