import { Inter } from "next/font/google";
import Image from "next/image";

export default function Diskon() {
  const clipPath = {
    clipPath: "polygon(0 10%, 20% 0, 80% 10%, 100% 0, 100% 100%, 0 100%)",
  };
  return (
    <div
      id="Diskon"
      className="h-max flex flex-col px-6 items-center bg-gradient-to-b from-Tertiary-60 to-Primary-60 pt-14"
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
