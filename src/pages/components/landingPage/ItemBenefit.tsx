import { Inter } from "next/font/google";

import Image from "next/image";
import { FC } from "react";

interface ItemBenefitProps {
  label: string;
}
const ItemBenefit: FC<ItemBenefitProps> = ({ label }) => {
  return (
    <div className="h-96 w-96 bg-white relative rounded shadow-[4px_4px_0px_0px_rgba(101,186,177,0.3)]  hover:scale-110 hover:transition-all">
      <Image
        src="imgProgram.svg"
        alt=""
        width={500}
        height={500}
        className="absolute w-full"
      />
      <p className="absolute text-lg bottom-0 left-2 font-bold text-Primary-10">
        {label}
      </p>
    </div>
  );
};

export default ItemBenefit;