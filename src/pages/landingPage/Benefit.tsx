import { Inter } from "next/font/google";
import ItemBenefit from "@/pages/components/landingPage/ItemBenefit";

export default function Benefit() {
  return (
    <div id="Benefit" className="flex flex-col pt-14">
      <h1 className="text-center font-bold text-3xl">Benefit</h1>
      <p className="text-center mb-9">
        Apa yang teman-teman dapatkan ketika bergabung dengan kami?
      </p>
      <div className="grid grid-cols-2 self-center gap-20 h-auto w-auto pb-24">
        <ItemBenefit />
        <ItemBenefit />
        <ItemBenefit />
        <ItemBenefit />
      </div>
    </div>
  );
}
