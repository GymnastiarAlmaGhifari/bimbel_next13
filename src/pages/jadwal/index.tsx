import React, { FC, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/buttons/Button";
import ItemJadwal from "../components/ItemJadwal";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { mutate } from "swr";
import { yupResolver } from "@hookform/resolvers/yup";

interface Jadwal {
  id: string;
  hari: string;
  jadwal_id: string;
  sesi_id: string;
  mapel_id: string;
  user_id: string;
  ruang_id: string;
  createdAt: string;
  updatedAt: string;
  sesi: {
    id: string;
    nama_sesi: string;
    jam_mulai: string;
    jam_selesai: string;
    createdAt: string;
    updatedAt: string;
  };
  mapel: {
    id: string;
    nama_mapel: string;
    kelas_id: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    nomor_telepon: string;
    alamat: string;
    universitas: string | null;
    mapel_id: string | null;
    image: string;
    random: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface Sesi {
  id: string;
  nama_sesi: string;
  jam_mulai: string;
  jam_selesai: string;
}

interface Ruang {
  id: string;
  nama_ruang: string;
  tipe: string;
}


const Jadwal: FC<Jadwal> = () => {

  const { data: sesi, error: errorsesi } = useSWR<Sesi[]>(
    "/api/sesi",
    fetcher,
    {}
  );

  const { data: ruang, error: errorruang } = useSWR<Ruang[]>("/api/ruang", fetcher, {});
  const [selectedRuang, setSelectedRuang] = useState("");

  const handleRuangChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const ruangId = event.target.value;
    setSelectedRuang(ruangId);
    console.log("Selected Ruang:", ruangId);
    // try {

    //   await axios.get("/api/jadwal/senin",
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //         // from : formData . image
    //         From: ruangId,
    //       },
    //     }
    //   );

    //   mutate("/api/ruang");

    // } catch (error) {
    //   if (axios.isAxiosError(error)) {
    //     const axiosError = error as AxiosError;
    //     console.error(axiosError.response?.data);
    //   } else {
    //     console.error(error);
    //   }
    // }
  };

  const { data: kamis, error: errorkamis } = useSWR<Jadwal[]>(
    selectedRuang ? `/api/jadwal/kamis?ruang_id=${selectedRuang}` : null,
    fetcher,
    {}
  );
  const { data: senin, error: errorsenin } = useSWR<Jadwal[]>(
    selectedRuang ? `/api/jadwal/sdjsh?ruang_id=${selectedRuang}` : null,
    fetcher,
    {}
  );
  console.log("Senin:", kamis);





  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg">
            <div>
              <h1 className="text-lg font-bold">Jadwal</h1>
              <div className="flex justify-between">
                <select
                  className="bg-Neutral-100 text-Primary-10 px-4 rounded-lg py-2 w-40 font-semibold"
                  value={selectedRuang}
                  onChange={handleRuangChange}
                  name="nama_ruang"
                >
                  <option value="">pilih</option>
                  {ruang?.map((ruang) => (
                    <option key={ruang.id} value={ruang.id}>
                      {ruang.nama_ruang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-8 grid-rows-4 auto-rows-max grid-flow-row gap-4 h-full">
              <div className="row-span-4 flex flex-col gap-4">
                {sesi?.map((item: any) => {
                  const hari_kamis = kamis?.find(
                    (hari_kamis) => hari_kamis.sesi.nama_sesi === item.nama_sesi
                  );
                  const hari_senin = senin?.find(
                    (hari_senin) => hari_senin.sesi.nama_sesi === item.nama_sesi
                  );
                  return (
                    <div key={item.id} className="flex justify-center items-center">
                      <div className="py-2 px-4 bg-Primary-20 rounded h-full text-Primary-90 font-bold mr-4">
                        <div className="flex flex-col justify-center items-center">
                          {item.nama_sesi}
                          <div>{item.jam_mulai} - {item.jam_selesai}</div>
                        </div>
                      </div>
                      {hari_kamis ? (
                        <div className="py-2 px-4 bg-Primary-20 rounded h-full text-Primary-90 font-bold ml-4">
                          <ItemJadwal
                            key={hari_kamis.id}
                            hari="sadawd"
                            kelompok={hari_kamis.sesi.nama_sesi}
                            nama_tentor={hari_kamis.user.name}
                          />
                        </div>
                      ) : (
                        <div className="py-2 px-4 bg-Primary-20 rounded h-full text-Primary-90 font-bold ml-4">
                          No schedule
                        </div>
                      )}
                      {hari_senin ? (
                        <div className="py-2 px-4 bg-Primary-20 rounded h-full text-Primary-90 font-bold ml-4">
                          <ItemJadwal
                            key={hari_senin.id}
                            hari="sadawd"
                            kelompok={hari_senin.sesi.nama_sesi}
                            nama_tentor={hari_senin.user.name}
                          />
                        </div>
                      ) : (
                        <div className="py-2 px-4 bg-Primary-20 rounded h-full text-Primary-90 font-bold ml-4">
                          No schedule
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jadwal;
