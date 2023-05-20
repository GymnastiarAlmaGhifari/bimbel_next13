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

  const { data: ruang, error: errorruang } = useSWR<Ruang[]>(
    "/api/ruang",
    fetcher,
    {}
  );
  const [selectedRuang, setSelectedRuang] = useState("");
  const [defaultRuang, setDefaultRuang] = useState("");

  useEffect(() => {
    if (ruang && ruang.length > 0) {
      setDefaultRuang(ruang[0].id);
      setSelectedRuang(ruang[0].id);
    }
  }, [ruang]);

  const handleRuangChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const ruangId = event.target.value;
    setSelectedRuang(ruangId);
  };

  const { data: senin, error: errorsenin } = useSWR<Jadwal[]>(
    selectedRuang ? `/api/jadwal/sdjsh?ruang_id=${selectedRuang}` : null,
    fetcher,
    {}
  );

  const { data: selasa, error: errorselasa } = useSWR<Jadwal[]>(
    selectedRuang ? `/api/jadwal/selasa?ruang_id=${selectedRuang}` : null,
    fetcher,
    {}
  );

  const { data: rabu, error: errorrabu } = useSWR<Jadwal[]>(
    selectedRuang ? `/api/jadwal/rabu?ruang_id=${selectedRuang}` : null,
    fetcher,
    {}
  );

  const { data: kamis, error: errorkamis } = useSWR<Jadwal[]>(
    selectedRuang ? `/api/jadwal/kamis?ruang_id=${selectedRuang}` : null,
    fetcher,
    {}
  );

  const { data: jumat, error: errorjumat } = useSWR<Jadwal[]>(
    selectedRuang ? `/api/jadwal/jumat?ruang_id=${selectedRuang}` : null,
    fetcher,
    {}
  );

  const { data: sabtu, error: errorsabtu } = useSWR<Jadwal[]>(
    selectedRuang ? `/api/jadwal/sabtu?ruang_id=${selectedRuang}` : null,
    fetcher,
    {}
  );

  const { data: minggu, error: errorminggu } = useSWR<Jadwal[]>(
    selectedRuang ? `/api/jadwal/minggu?ruang_id=${selectedRuang}` : null,
    fetcher,
    {}
  );

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg">
            <div>
              <div className="flex justify-between">
                <h1 className="text-lg font-bold">Jadwal</h1>
                <select
                  className="bg-Neutral-100 text-Primary-10 px-4 rounded py-2 w-40 font-semibold border-[2px] outline-none"
                  value={selectedRuang}
                  onChange={handleRuangChange}
                  name="nama_ruang"
                >
                  {ruang?.map((ruang) => (
                    <option key={ruang.id} value={ruang.id}>
                      {ruang.nama_ruang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="h-full flex flex-col gap-4  justify-between">
              <div className="flex gap-4 w-full">
                <div className="py-2 px-4 w-full rounded-lg bg-Primary-20 text-Primary-90 font-semibold text-center">
                  Hari
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Primary-20 text-Primary-90 font-semibold text-center">
                  Senin
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Primary-20 text-Primary-90 font-semibold text-center">
                  Selasa
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Primary-20 text-Primary-90 font-semibold text-center">
                  rabu
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Primary-20 text-Primary-90 font-semibold text-center">
                  Kamis
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Primary-20 text-Primary-90 font-semibold text-center">
                  Jumat
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Primary-20 text-Primary-90 font-semibold text-center">
                  Sabtu
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Primary-20 text-Primary-90 font-semibold text-center">
                  Minggu
                </div>
              </div>
              {sesi?.map((item: any) => {
                const hari_senin = senin?.find(
                  (hari_senin) => hari_senin.sesi.nama_sesi === item.nama_sesi
                );

                const hari_selasa = selasa?.find(
                  (hari_selasa) => hari_selasa.sesi.nama_sesi === item.nama_sesi
                );

                const hari_rabu = rabu?.find(
                  (hari_rabu) => hari_rabu.sesi.nama_sesi === item.nama_sesi
                );

                const hari_kamis = kamis?.find(
                  (hari_kamis) => hari_kamis.sesi.nama_sesi === item.nama_sesi
                );

                const hari_jumat = jumat?.find(
                  (hari_jumat) => hari_jumat.sesi.nama_sesi === item.nama_sesi
                );

                const hari_sabtu = sabtu?.find(
                  (hari_sabtu) => hari_sabtu.sesi.nama_sesi === item.nama_sesi
                );

                const hari_minggu = minggu?.find(
                  (hari_minggu) => hari_minggu.sesi.nama_sesi === item.nama_sesi
                );

                return (
                  <div
                    key={item.id}
                    className="flex justify-between h-full gap-4"
                  >
                    <div className="py-2 px-4 bg-Primary-20 rounded-lg h-full text-Primary-90 font-bold w-full flex flex-col items-center justify-center">
                      <div className="flex flex-col justify-center items-center ">
                        {item.nama_sesi}
                        <div className="text-xs">
                          {item.jam_mulai} - {item.jam_selesai}
                        </div>
                      </div>
                    </div>
                    {hari_senin ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        <ItemJadwal
                          key={hari_senin.id}
                          hari="sadawd"
                          kelompok={hari_senin.sesi.nama_sesi}
                          nama_tentor={hari_senin.user.name}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        No schedule
                      </div>
                    )}
                    {hari_selasa ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        <ItemJadwal
                          key={hari_selasa.id}
                          hari="sadawd"
                          kelompok={hari_selasa.sesi.nama_sesi}
                          nama_tentor={hari_selasa.user.name}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        No schedule
                      </div>
                    )}
                    {hari_rabu ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        <ItemJadwal
                          key={hari_rabu.id}
                          hari="sadawd"
                          kelompok={hari_rabu.sesi.nama_sesi}
                          nama_tentor={hari_rabu.user.name}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        No schedule
                      </div>
                    )}
                    {hari_kamis ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        <ItemJadwal
                          key={hari_kamis.id}
                          hari="sadawd"
                          kelompok={hari_kamis.sesi.nama_sesi}
                          nama_tentor={hari_kamis.user.name}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        No schedule
                      </div>
                    )}
                    {hari_jumat ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        <ItemJadwal
                          key={hari_jumat.id}
                          hari="sadawd"
                          kelompok={hari_jumat.sesi.nama_sesi}
                          nama_tentor={hari_jumat.user.name}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        No schedule
                      </div>
                    )}
                    {hari_sabtu ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        <ItemJadwal
                          key={hari_sabtu.id}
                          hari="sadawd"
                          kelompok={hari_sabtu.sesi.nama_sesi}
                          nama_tentor={hari_sabtu.user.name}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        No schedule
                      </div>
                    )}
                    {hari_minggu ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
                        <ItemJadwal
                          key={hari_minggu.id}
                          hari="sadawd"
                          kelompok={hari_minggu.sesi.nama_sesi}
                          nama_tentor={hari_minggu.user.name}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center">
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
  );
};

export default Jadwal;
