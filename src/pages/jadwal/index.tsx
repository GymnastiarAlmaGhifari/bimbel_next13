import React, { FC, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Button from "../components/buttons/Button";
import ItemJadwal, { ItemJadwalBelumTerisi } from "../components/ItemJadwal";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { mutate } from "swr";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoIosArrowDown, IoIosArrowUp, IoIosAdd } from "react-icons/io";
import { ModalDetail, ModalSucces } from "@/pages/components/modal/Modal";
import Senin from "./modal/senin";
import Selasa from "./modal/selasa";
import Rabu from "./modal/rabu";
import Kamis from "./modal/kamis";
import Jumat from "./modal/jumat";
import Sabtu from "./modal/sabtu";
import Minggu from "./modal/minggu";

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

const schema = yup.object().shape({
  ruang_id: yup.string(),
});
type FormData = yup.InferType<typeof schema>;

const Jadwal: FC<Jadwal> = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { data: ruang, error: errorruang } = useSWR<Ruang[]>(
    "/api/ruang",
    fetcher,
    {}
  );
  // const [selectRuang, setselectRuang] = useState("");
  // const [defaultRuang, setDefaultRuang] = useState("");
  const [selectedRuangId, setSelectedRuangId] = useState("");

  useEffect(() => {
    if (ruang && ruang.length > 0) {
      setValue("ruang_id", ruang[0].id);
      console.log(ruang[0].id);
      setSelectedRuangId(ruang[0].id);
    }
  }, [ruang, setValue]);

  // const handleRuangChange = async (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const ruangId = event.target.value;
  //   setselectRuang(ruangId);
  // };

  const [listOpenRuang, setIsListOpenRuang] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenRuang(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenRuang, componentRef]);

  const toggleListRuang = () => {
    setIsListOpenRuang(!listOpenRuang);
  };

  const selectRuang = (ruang_id: string) => {
    setValue("ruang_id", ruang_id);
    setSelectedRuangId(ruang_id);
    setIsListOpenRuang(false);
    setSelectedRuangIdPass(ruang_id);
  };

  // useEffect(() => {
  //   setSelectedRuangIdPass(ruang_id);
  // }, [ruang_id]);

  useEffect(() => {
    setSelectedRuangIdPass(selectedRuangId);
  }, [selectedRuangId]);



  const {
    data: sesi,
    error: errorsesi,
    isLoading: sesiLoading,
  } = useSWR<Sesi[]>("/api/sesi", fetcher, {
    shouldRetryOnError: false,
  });

  const {
    data: senin,
    error: errorsenin,
    isLoading: seninloading,
  } = useSWR<Jadwal[]>(
    selectedRuangId
      ? `/api/jadwal/hari?hari=SENIN&ruang_id=${selectedRuangId}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  const {
    data: selasa,
    error: errorselasa,
    isLoading: selasaLoading,
  } = useSWR<Jadwal[]>(
    selectedRuangId
      ? `/api/jadwal/hari?hari=SELASA&ruang_id=${selectedRuangId}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  const {
    data: rabu,
    error: errorrabu,
    isLoading: rabuLoading,
  } = useSWR<Jadwal[]>(
    selectedRuangId
      ? `/api/jadwal/hari?hari=RABU&ruang_id=${selectedRuangId}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  const {
    data: kamis,
    error: errorkamis,
    isLoading: kamisLoading,
  } = useSWR<Jadwal[]>(
    selectedRuangId
      ? `/api/jadwal/hari?hari=KAMIS&ruang_id=${selectedRuangId}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  const {
    data: jumat,
    error: errorjumat,
    isLoading: jumatLoading,
  } = useSWR<Jadwal[]>(
    selectedRuangId
      ? `/api/jadwal/hari?hari=JUMAT&ruang_id=${selectedRuangId}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  const {
    data: sabtu,
    error: errorsabtu,
    isLoading: sabtuLoading,
  } = useSWR<Jadwal[]>(
    selectedRuangId
      ? `/api/jadwal/hari?hari=SABTU&ruang_id=${selectedRuangId}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  const {
    data: minggu,
    error: errorminggu,
    isLoading: mingguLoading,
  } = useSWR<Jadwal[]>(
    selectedRuangId
      ? `/api/jadwal/hari?hari=MINGGU&ruang_id=${selectedRuangId}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  // useState untuk modal setiap id perhari
  const [seninModal, setSeninModal] = useState<Jadwal | null>(null);
  const [selasaModal, setSelasaModal] = useState<Jadwal | null>(null);
  const [rabuModal, setRabuModal] = useState<Jadwal | null>(null);
  const [kamisModal, setKamisModal] = useState<Jadwal | null>(null);
  const [jumatModal, setJumatModal] = useState<Jadwal | null>(null);
  const [sabtuModal, setSabtuModal] = useState<Jadwal | null>(null);
  const [mingguModal, setMingguModal] = useState<Jadwal | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccess(false);
    }, 2500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccess]);

  // useState untuk modal create jadwal perhari
  const [seninModalCreate, setSeninModalCreate] = useState(false);

  // state simpan id ruang dengan variable berbeda
  const [selectedRuangIdPass, setSelectedRuangIdPass] = useState("");
  // const nama ruang selected
  const [selectedRuang, setSelectedRuang] = useState("");

  return (
    <div className="flex flex-row h-screen font-mulish">
      <Sidebar />
      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-5 bg-Neutral-95 overflow-auto">
          <div className="flex flex-col h-full p-4 gap-4 bg-Neutral-100 rounded-lg w-full">
            <div>
              <div className="flex justify-between">
                <h1 className="text-lg font-bold">Jadwal</h1>
                <div className="flex flex-col w-52 relative">
                  <button
                    type="button"
                    className={`w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${listOpenRuang
                      ? "border-[2px] border-Primary-50 bg-Primary-95"
                      : "bg-Neutral-95"
                      }`}
                    onClick={toggleListRuang}
                  >
                    {
                      ruang?.find((ruang) => ruang.id === watch("ruang_id"))
                        ?.nama_ruang
                    }
                    {listOpenRuang ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                  {listOpenRuang && (
                    <ul
                      ref={componentRef}
                      className="absolute w-full z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl p-2 outline-none appearance-none flex flex-col gap-1 top-0 translate-y-[44px]"
                    >
                      {errorruang ? (
                        <li className="text-center">Error</li>
                      ) : !ruang ? (
                        <li className="text-center">Loading...</li>
                      ) : ruang.length === 0 ? (
                        <li className="text-center">Data Kosong</li>
                      ) : (
                        ruang.map((ruang) => (
                          <li key={ruang.id}>
                            <button
                              className={`w-full text-left px-4 py-1 rounded-full ${watch("ruang_id") === ruang.id
                                ? "text-Primary-90 bg-Primary-20"
                                : "text-Primary-20 hover:bg-Primary-95"
                                }`}
                              onClick={() => {
                                selectRuang(ruang.id);
                                console.log(ruang.id);
                              }}
                            >
                              {ruang.nama_ruang}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>

                {errors.ruang_id && (
                  <span className="text-red-500">
                    {errors.ruang_id.message}
                  </span>
                )}
              </div>
            </div>
            <div className="h-full flex flex-col gap-4 justify-between">
              <div className="flex gap-4 w-full">
                <div className="py-2 px-4 w-full rounded-lg bg-Neutral-100 text-Primary-20 shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] font-semibold text-center ">
                  Hari
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Neutral-100 text-Primary-20 shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] font-semibold text-center ">
                  Senin
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Neutral-100 text-Primary-20 shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] font-semibold text-center ">
                  Selasa
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Neutral-100 text-Primary-20 shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] font-semibold text-center ">
                  rabu
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Neutral-100 text-Primary-20 shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] font-semibold text-center ">
                  Kamis
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Neutral-100 text-Primary-20 shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] font-semibold text-center ">
                  Jumat
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Neutral-100 text-Primary-20 shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] font-semibold text-center ">
                  Sabtu
                </div>
                <div className="py-2 px-4 w-full rounded-lg bg-Neutral-100 text-Primary-20 shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] font-semibold text-center ">
                  Minggu
                </div>
              </div>
              {sesi?.map((item: any) => {
                const hari_senin = senin?.find(
                  (hari_senin) => hari_senin.sesi?.nama_sesi === item.nama_sesi
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
                    <div className="py-2 px-4 bg-Primary-20 rounded-lg h-full text-Primary-90 font-bold w-full flex flex-col items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)]">
                      <div className="flex flex-col justify-center items-center ">
                        {item.nama_sesi}
                        <div className="text-xs">
                          {item.jam_mulai} - {item.jam_selesai}
                        </div>
                      </div>
                    </div>
                    {hari_senin ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_senin.id}
                          hari="sadawd"
                          kelompok={hari_senin.sesi.nama_sesi}
                          nama_tentor={hari_senin.user.name}
                          onClick={() => {
                            setSeninModal(hari_senin);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] flex-col relative">
                        <ItemJadwalBelumTerisi
                          onClick={() => {
                            setSeninModalCreate(true);
                          }}
                        />
                      </div>
                    )}
                    {hari_selasa ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_selasa.id}
                          hari="sadawd"
                          kelompok={hari_selasa.sesi.nama_sesi}
                          nama_tentor={hari_selasa.user.name}
                          onClick={() => {
                            setSelasaModal(hari_selasa);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        Tidak Ada Jadwal
                      </div>
                    )}
                    {hari_rabu ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_rabu.id}
                          hari="sadawd"
                          kelompok={hari_rabu.sesi.nama_sesi}
                          nama_tentor={hari_rabu.user.name}
                          onClick={() => {
                            setRabuModal(hari_rabu);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        Tidak Ada Jadwal
                      </div>
                    )}
                    {hari_kamis ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full w-full flex items-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_kamis.id}
                          hari="sadawd"
                          kelompok={hari_kamis.sesi.nama_sesi}
                          nama_tentor={hari_kamis.user.name}
                          onClick={() => {
                            setKamisModal(hari_kamis);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        Tidak Ada Jadwal
                      </div>
                    )}
                    {hari_jumat ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_jumat.id}
                          hari="sadawd"
                          kelompok={hari_jumat.sesi.nama_sesi}
                          nama_tentor={hari_jumat.user.name}
                          onClick={() => {
                            setJumatModal(hari_jumat);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        Tidak Ada Jadwal
                      </div>
                    )}
                    {hari_sabtu ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_sabtu.id}
                          hari="sadawd"
                          kelompok={hari_sabtu.sesi.nama_sesi}
                          nama_tentor={hari_sabtu.user.name}
                          onClick={() => {
                            setSabtuModal(hari_sabtu);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        Tidak Ada Jadwal{" "}
                      </div>
                    )}
                    {hari_minggu ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_minggu.id}
                          hari="sadawd"
                          kelompok={hari_minggu.sesi.nama_sesi}
                          nama_tentor={hari_minggu.user.name}
                          onClick={() => {
                            setMingguModal(hari_minggu);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        Tidak Ada Jadwal
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {seninModal ? (
        <ModalDetail
          wAuto
          titleModal="Detail Jadwal"
          onClose={() => {
            setSeninModal(null);
          }}
        >
          <Senin
            jadwalId={seninModal.id}
            data={seninModal}
            idRuang={selectedRuangIdPass}
            onClose={() => {
              setSeninModal(null);
            }}
            onSucsess={() => {
              setShowSuccess(true);
            }}
          />
        </ModalDetail>
      ) : kamisModal ? (
        <ModalDetail
          titleModal="Detail Jadwal"
          onClose={() => {
            setKamisModal(null);
          }}
        >
          <div className="">
            test
            {kamisModal.sesi.nama_sesi}
            <Kamis />
          </div>
        </ModalDetail>
      ) : rabuModal ? (
        <ModalDetail
          titleModal="Detail Jadwal"
          onClose={() => {
            setRabuModal(null);
          }}
        >
          <div className="">
            test
            {rabuModal.sesi.nama_sesi}
            <Rabu />
          </div>
        </ModalDetail>
      ) : jumatModal ? (
        <ModalDetail
          titleModal="Detail Jadwal"
          onClose={() => {
            setJumatModal(null);
          }}
        >
          <div className="">
            test
            {jumatModal.sesi.nama_sesi}
            <Jumat />
          </div>
        </ModalDetail>
      ) : sabtuModal ? (
        <ModalDetail
          titleModal="Detail Jadwal"
          onClose={() => {
            setSabtuModal(null);
          }}
        >
          <div className="">
            test
            {sabtuModal.sesi.nama_sesi}
            <Sabtu />
          </div>
        </ModalDetail>
      ) : mingguModal ? (
        <ModalDetail
          titleModal="Detail Jadwal"
          onClose={() => {
            setMingguModal(null);
          }}
        >
          <div className="">
            test
            {mingguModal.sesi.nama_sesi}
            <Minggu />
          </div>
        </ModalDetail>
      ) : selasaModal ? (
        <ModalDetail
          titleModal="Detail Jadwal"
          onClose={() => {
            setSelasaModal(null);
          }}
        >
          <div className="">
            test
            {selasaModal.sesi.nama_sesi}
            <Jumat />
          </div>
        </ModalDetail>
      ) : (
        <div></div>
      )}
      {showSuccess && (
        <ModalSucces label="POOP" onClose={() => setShowSuccess(false)}>
          {/* <div className="flex flex-col items-center justify-center">
            <h1 className=" font-bold text-green-500">Berhasil</h1>
            <p className="text-sm text-gray-500">
              {selected?.name}Data berhasil diubah
            </p>
          </div> */}
        </ModalSucces>
      )}
      {seninModalCreate ? (
        <ModalDetail
          titleModal="Detail Jadwal"
          onClose={() => {
            setSeninModalCreate(false);
          }}
        >
          <div className="">iwajdiwajida</div>
        </ModalDetail>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Jadwal;
