import { Inter } from "next/font/google";
import Image from "next/image";
// swr
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Keyboard, Scrollbar, Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
export default function Diskon() {
  const clipPath = {
    clipPath:
      "polygon(0 3%, 3% 5%, 17% 0, 30% 3%, 32% 0%, 34% 3%, 40% 0%, 60% 5%, 62% 0%, 63% 2%, 70% 0%, 80% 6%, 85% 5%, 90% 7% , 100% 0, 100% 100%, 0 100%)",
  };

  const { data: gambar } = useSWR("/api/diskon", fetcher, {});

  return (
    <div
      id="Diskon"
      className="h-screen flex flex-col px-6 items-center bg-gradient-to-b from-Tertiary-60 to-Primary-60 py-24 relative"
      style={clipPath}
    >
      <h1 className="text-center font-bold text-white text-3xl">Diskon</h1>
      <p className="text-center mb-9 text-Neutral-100">Hanya Untuk Bulan Ini</p>
      {/* maping data dari gambar */}
      <div className="h-full w-full overflow-clip rounded-lg">
        <Swiper
          slidesPerView={1}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation={true}
          modules={[Autoplay, Navigation]}
        >
          {gambar
            ? gambar.map((item: any) => (
                // eslint-disable-next-line react/jsx-key
                <SwiperSlide>
                  <Image
                    alt="diskon"
                    src={
                      item.banner
                        ? "/api/diskon/img?img=" + item.banner
                        : "/img/user/default.png"
                    }
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                    loader={({ src }) => `${src}?cache-control=no-store`}
                  />
                </SwiperSlide>
              ))
            : ""}
        </Swiper>
      </div>
    </div>
  );
}
