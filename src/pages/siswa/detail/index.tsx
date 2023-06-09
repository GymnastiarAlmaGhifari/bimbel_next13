import Image from "next/image";
import React, { FC } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import useSWR, { mutate } from "swr";
import fetcher from "@/libs/fetcher";

interface DetailSiswaProps {
  idSiswa: string;
  onClose: () => void;
}

interface Siswa {
  id: string;
  email: string;
  nama: string;
  nomor_telepon: string;
  alamat: string;
  sekolah: string;
  hp_ortu: string;
  image: string;
}

const DetailSiswa: FC<DetailSiswaProps> = ({ idSiswa, onClose }) => {
  const {
    data: getSiswa,
    error: getSiswaError,
    isLoading: getSiswaLoading,
  } = useSWR<Siswa>(`/api/siswa/${idSiswa}`, fetcher);


  if (getSiswaLoading) {
    // Show loading state while data is being fetched
    return <div>Loading...</div>;
  }

  if (getSiswaError) {
    // Handle error state if there is an error while fetching data
    return <div>Error: {getSiswaError.message}</div>;
  }

  if (!getSiswa) {
    // Handle case where data is not available
    return <div>No data available.</div>;
  }

  // flex flex-col gap-6 w-[400px] rounded-lg
  return (
    <div className="flex gap-10">
      <div className="flex flex-col gap-6 w-[400px] border rounded-lg">
        <Image
          src={`/api/siswa/img?img=` + getSiswa?.image || "/api/siswa/img?img=placeholder.png"}
          alt="Gambar"
          width={200}
          height={200}
          className="rounded-lg object-cover wf-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Email</h3>
          <span className="font-bold text-Primary-10">{getSiswa?.email}</span>
          <div className="w-full h-[1px] bg-Neutral-90"></div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">No. Telp</h3>
          <span className="font-bold text-Primary-10">
            {getSiswa?.nomor_telepon}
          </span>
          <div className="w-full h-[1px] bg-Neutral-90"></div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Alamat</h3>
          <span className="font-bold text-Primary-10">
            {getSiswa?.alamat ? getSiswa.alamat : "-"}
          </span>
          <div className="w-full h-[1px] bg-Neutral-90"></div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">Sekolah</h3>
          <span className="font-bold text-Primary-10">
            {getSiswa?.sekolah ? getSiswa?.sekolah : "-"}
          </span>
          <div className="w-full h-[1px] bg-Neutral-90"></div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-Neutral-30">HP Ortu</h3>
          <span className="font-bold text-Primary-10">
            {getSiswa?.hp_ortu ? getSiswa?.hp_ortu : "-"}
          </span>
          <div className="w-full h-[1px] bg-Neutral-90"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailSiswa;
