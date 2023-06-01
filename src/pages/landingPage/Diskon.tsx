import { Inter } from "next/font/google";
import Image from "next/image";

export default function Diskon() {
  const clipPath = {
    clipPath:
      "polygon(0 3%, 3% 5%, 10% 0, 13% 5%, 17% 0, 30% 3%, 32% 0%, 34% 3%, 40% 0%, 60% 5%, 62% 0%, 63% 2%, 70% 0%, 80% 10%, 85% 5%, 90% 7% , 100% 0, 100% 100%, 0 100%)",
  };
  return (
    <div
      id="Diskon"
      className="h-screen flex flex-col px-6 items-center bg-gradient-to-b from-Tertiary-60 to-Primary-60 pt-24"
      style={clipPath}
    >
      <h1 className="text-center font-bold text-white text-3xl">Diskon</h1>
      <p className="text-center mb-9 text-Neutral-100">Hanya Untuk Bulan Ini</p>
      <div className="aspect-video flex items-center rounded-lg overflow-clip bg-white scale-90">
        <Image
          alt="diskon"
          src="/diskon1.jpg"
          width={200}
          height={200}
          className="bg-cover w-full"
        />
      </div>
    </div>
  );
}
