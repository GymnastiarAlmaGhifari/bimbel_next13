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
import SeninEdit from "./Edit/senin";
import KamisEdit from "./Edit/kamis";
import RabuEdit from "./Edit/rabu";
import JumatEdit from "./Edit/jumat";
import SabtuEdit from "./Edit/sabtu";
import MingguEdit from "./Edit/minggu";
import SelasaEdit from "./Edit/selasa";
import DeleteSenin from "./Delete/senin";
import DeleteSelasa from "./Delete/selasa";
import DeleteRabu from "./Delete/rabu";
import DeleteKamis from "./Delete/kamis";
import DeleteJumat from "./Delete/jumat";
import DeleteSabtu from "./Delete/sabtu";
import DeleteMinggu from "./Delete/minggu";
import CreateSenin from "./Create/senin";
import CreateSelasa from "./Create/selasa";
import CreateRabu from "./Create/rabu";
import CreateKamis from "./Create/kamis";
import CreateJumat from "./Create/jumat";
import CreateSabtu from "./Create/sabtu";
import CreateMinggu from "./Create/minggu";

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
  kelompok: {
    id: string;
    nama_kelompok: string;
  };
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

  const [listOpenRuang, setIsListOpenRuang] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);
  const [selectNamaRuang, setSelectNamaRuang] = useState("");

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
    if (ruang && ruang.length > 0) {
      setSelectNamaRuang(ruang[0].nama_ruang);
    }
  }, [selectedRuangId, selectNamaRuang]);

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
  const [seninModalCreate, setSeninModalCreate] = useState(null);
  const [selasaModalCreate, setSelasaModalCreate] = useState(null);
  const [rabuModalCreate, setRabuModalCreate] = useState(null);
  const [kamisModalCreate, setKamisModalCreate] = useState(null);
  const [jumatModalCreate, setJumatModalCreate] = useState(null);
  const [sabtuModalCreate, setSabtuModalCreate] = useState(null);
  const [mingguModalCreate, setMingguModalCreate] = useState(null);

  // useState untuk modal delete jadwal perhari
  const [seninModalDelete, setSeninModalDelete] = useState<Jadwal | null>(null);
  const [selasaModalDelete, setSelasaModalDelete] = useState<Jadwal | null>(
    null
  );
  const [rabuModalDelete, setRabuModalDelete] = useState<Jadwal | null>(null);
  const [kamisModalDelete, setKamisModalDelete] = useState<Jadwal | null>(null);
  const [jumatModalDelete, setJumatModalDelete] = useState<Jadwal | null>(null);
  const [sabtuModalDelete, setSabtuModalDelete] = useState<Jadwal | null>(null);
  const [mingguModalDelete, setMingguModalDelete] = useState<Jadwal | null>(
    null
  );

  // state simpan id ruang dengan variable berbeda
  const [selectedRuangIdPass, setSelectedRuangIdPass] = useState("");
  // const nama ruang selected
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
                                setSelectNamaRuang(ruang.nama_ruang);
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
                          nama_mapel={hari_senin.mapel.nama_mapel}
                          kelompok={hari_senin.kelompok.nama_kelompok}
                          nama_tentor={hari_senin.user.name}
                          onClick={() => {
                            setSeninModal(hari_senin);
                          }}
                          onDelete={() => {
                            setSeninModalDelete(hari_senin);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] flex-col relative">
                        <ItemJadwalBelumTerisi
                          onClick={() => {
                            setSeninModalCreate(item.id);
                          }}
                        />
                      </div>
                    )}
                    {hari_selasa ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_selasa.id}
                          nama_mapel={hari_selasa.mapel.nama_mapel}
                          kelompok={hari_selasa.kelompok.nama_kelompok}
                          nama_tentor={hari_selasa.user.name}
                          onClick={() => {
                            setSelasaModal(hari_selasa);
                          }}
                          onDelete={() => {
                            setSelasaModalDelete(hari_selasa);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwalBelumTerisi
                          onClick={() => {
                            setSelasaModalCreate(item.id);
                          }}
                        />
                      </div>
                    )}
                    {hari_rabu ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_rabu.id}
                          nama_mapel={hari_rabu.mapel.nama_mapel}
                          kelompok={hari_rabu.kelompok.nama_kelompok}
                          nama_tentor={hari_rabu.user.name}
                          onClick={() => {
                            setRabuModal(hari_rabu);
                          }}
                          onDelete={() => {
                            setRabuModalDelete(hari_rabu);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwalBelumTerisi
                          onClick={() => {
                            setRabuModalCreate(item.id);
                          }}

                        />
                      </div>
                    )}
                    {hari_kamis ? (
                      <div className="py-2 px-4 bg-Tertiary-50 text-Tertiary-90 rounded-lg h-full w-full flex items-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_kamis.id}
                          nama_mapel={hari_kamis.mapel.nama_mapel}
                          kelompok={hari_kamis.kelompok.nama_kelompok}
                          nama_tentor={hari_kamis.user.name}
                          onClick={() => {
                            setKamisModal(hari_kamis);
                          }}
                          onDelete={() => {
                            setKamisModalDelete(hari_kamis);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwalBelumTerisi
                          onClick={() => {
                            setKamisModalCreate(item.id);
                          }}
                        />
                      </div>
                    )}
                    {hari_jumat ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_jumat.id}
                          nama_mapel={hari_jumat.mapel.nama_mapel}
                          kelompok={hari_jumat.kelompok.nama_kelompok}
                          nama_tentor={hari_jumat.user.name}
                          onClick={() => {
                            setJumatModal(hari_jumat);
                          }}
                          onDelete={() => {
                            setJumatModalDelete(hari_jumat);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwalBelumTerisi
                          onClick={() => {
                            setJumatModalCreate(item.id);
                          }}
                        />
                      </div>
                    )}
                    {hari_sabtu ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_sabtu.id}
                          nama_mapel={hari_sabtu.mapel.nama_mapel}
                          kelompok={hari_sabtu.kelompok.nama_kelompok}
                          nama_tentor={hari_sabtu.user.name}
                          onClick={() => {
                            setSabtuModal(hari_sabtu);
                          }}
                          onDelete={() => {
                            setSabtuModalDelete(hari_sabtu);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwalBelumTerisi
                          onClick={() => {
                            setSabtuModalCreate(item.id);
                          }}
                        />
                      </div>
                    )}
                    {hari_minggu ? (
                      <div className="py-2 px-4 bg-Tertiary-50 rounded-lg h-full text-Tertiary-90 font-bold w-full flex items-center justify-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwal
                          key={hari_minggu.id}
                          nama_mapel={hari_minggu.mapel.nama_mapel}
                          kelompok={hari_minggu.kelompok.nama_kelompok}
                          nama_tentor={hari_minggu.user.name}
                          onClick={() => {
                            setMingguModal(hari_minggu);
                          }}
                          onDelete={() => {
                            setMingguModalDelete(hari_minggu);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="py-2 px-4 bg-Error-40 rounded-lg h-full text-Error-90 font-bold w-full flex items-center justify-center text-center shadow-[0px_0px_10px_5px_rgba(149,146,146,.25)] relative">
                        <ItemJadwalBelumTerisi
                          onClick={() => {
                            setMingguModalCreate(item.id);
                          }}
                        />
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
          titleModal="Edit Jadwal"
          onClose={() => {
            setSeninModal(null);
          }}
        >
          <SeninEdit
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
          wAuto
          titleModal="Edit Jadwal"
          onClose={() => {
            setKamisModal(null);
          }}
        >
          <KamisEdit
            jadwalId={kamisModal.id}
            data={kamisModal}
            idRuang={selectedRuangIdPass}
            onClose={() => {
              setKamisModal(null);
            }}
            onSucsess={() => {
              setShowSuccess(true);
            }}
          />
        </ModalDetail>
      ) : rabuModal ? (
        <ModalDetail
          wAuto
          titleModal="Edit Jadwal"
          onClose={() => {
            setRabuModal(null);
          }}
        >
          <RabuEdit
            jadwalId={rabuModal.id}
            data={rabuModal}
            idRuang={selectedRuangIdPass}
            onClose={() => {
              setRabuModal(null);
            }}
            onSucsess={() => {
              setShowSuccess(true);
            }}
          />
        </ModalDetail>
      ) : jumatModal ? (
        <ModalDetail
          wAuto
          titleModal="Edit Jadwal"
          onClose={() => {
            setJumatModal(null);
          }}
        >
          <JumatEdit
            jadwalId={jumatModal.id}
            data={jumatModal}
            idRuang={selectedRuangIdPass}
            onClose={() => {
              setJumatModal(null);
            }}
            onSucsess={() => {
              setShowSuccess(true);
            }}
          />
        </ModalDetail>
      ) : sabtuModal ? (
        <ModalDetail
          wAuto
          titleModal="Edit Jadwal"
          onClose={() => {
            setSabtuModal(null);
          }}
        >
          <SabtuEdit
            jadwalId={sabtuModal.id}
            data={sabtuModal}
            idRuang={selectedRuangIdPass}
            onClose={() => {
              setSabtuModal(null);
            }}
            onSucsess={() => {
              setShowSuccess(true);
            }}
          />
        </ModalDetail>
      ) : mingguModal ? (
        <ModalDetail
          wAuto
          titleModal="Edit Jadwal"
          onClose={() => {
            setMingguModal(null);
          }}
        >
          <MingguEdit
            jadwalId={mingguModal.id}
            data={mingguModal}
            idRuang={selectedRuangIdPass}
            onClose={() => {
              setMingguModal(null);
            }}
            onSucsess={() => {
              setShowSuccess(true);
            }}
          />
        </ModalDetail>
      ) : selasaModal ? (
        <ModalDetail
          wAuto
          titleModal="Edit Jadwal"
          onClose={() => {
            setSelasaModal(null);
          }}
        >
          <SelasaEdit
            jadwalId={selasaModal.id}
            data={selasaModal}
            idRuang={selectedRuangIdPass}
            onClose={() => {
              setSelasaModal(null);
            }}
            onSucsess={() => {
              setShowSuccess(true);
            }}
          />
        </ModalDetail>
      ) : (
        <div></div>
      )}
      {showSuccess && (
        <ModalSucces
          label="POOP"
          onClose={() => setShowSuccess(false)}
        >
          Jadwal berhasil diubah
        </ModalSucces>
      )}
      {seninModalCreate ? (
        <ModalDetail
          wAuto
          titleModal="Tambah Jadwal"
          onClose={() => {
            setSeninModalCreate(null);
          }}
        >
          <CreateSenin
            data={seninModalCreate}
            idRuang={selectedRuangIdPass}
            jadwalId=""
            onClose={() => setSeninModalCreate(null)}
            onSucsess={() => { }}
          />
        </ModalDetail>
      ) : selasaModalCreate ? (
        <ModalDetail
          wAuto
          titleModal="Tambah Jadwal"
          onClose={() => {
            setSelasaModalCreate(null);
          }}
        >
          <CreateSelasa
            data={selasaModalCreate}
            idRuang={selectedRuangIdPass}
            jadwalId=""
            onClose={() => setSelasaModalCreate(null)}
            onSucsess={() => { }}
          />
        </ModalDetail>
      ) : rabuModalCreate ? (
        <ModalDetail
          wAuto
          titleModal="Tambah Jadwal"
          onClose={() => {
            setRabuModalCreate(null);
          }}
        >
          <CreateRabu
            data={rabuModalCreate}
            idRuang={selectedRuangIdPass}
            jadwalId=""
            onClose={() => setRabuModalCreate(null)}
            onSucsess={() => { }}
          />
        </ModalDetail>
      ) : kamisModalCreate ? (
        <ModalDetail
          wAuto
          titleModal="Tambah Jadwal"
          onClose={() => {
            setKamisModalCreate(null);
          }}
        >
          <CreateKamis
            data={kamisModalCreate}
            idRuang={selectedRuangIdPass}
            jadwalId=""
            onClose={() => setKamisModalCreate(null)}
            onSucsess={() => { }}
          />
        </ModalDetail>
      ) : jumatModalCreate ? (
        <ModalDetail
          wAuto
          titleModal="Tambah Jadwal"
          onClose={() => {
            setJumatModalCreate(null);
          }}
        >
          <CreateJumat
            data={jumatModalCreate}
            idRuang={selectedRuangIdPass}
            jadwalId=""
            onClose={() => setJumatModalCreate(null)}
            onSucsess={() => { }}
          />
        </ModalDetail>
      ) : sabtuModalCreate ? (
        <ModalDetail
          wAuto
          titleModal="Tambah Jadwal"
          onClose={() => {
            setSabtuModalCreate(null);
          }}
        >
          <CreateSabtu
            data={sabtuModalCreate}
            idRuang={selectedRuangIdPass}
            jadwalId=""
            onClose={() => setSabtuModalCreate(null)}
            onSucsess={() => { }}
          />
        </ModalDetail>
      ) : mingguModalCreate ? (
        <ModalDetail
          wAuto
          titleModal="Tambah Jadwal"
          onClose={() => {
            setMingguModalCreate(null);
          }}
        >
          <CreateMinggu
            data={mingguModalCreate}
            idRuang={selectedRuangIdPass}
            jadwalId=""
            onClose={() => setMingguModalCreate(null)}
            onSucsess={() => { }}
          />
        </ModalDetail>
      ) : (
        <div></div>
      )}

      {seninModalDelete ? (
        <ModalDetail
          titleModal="Hapus Jadwal"
          onClose={() => {
            setSeninModalDelete(null);
          }}
        >
          <DeleteSenin
            hari={seninModalDelete.hari}
            ruang={selectNamaRuang}
            sesi={seninModalDelete.sesi.nama_sesi}
            idRuang={selectedRuangIdPass}
            jadwalId={seninModalDelete.id}
            onClose={() => setSeninModalDelete(null)}
            onSuccess={() => { }}
          />
        </ModalDetail>
      ) : selasaModalDelete ? (
        <ModalDetail
          titleModal="Hapus Jadwal"
          onClose={() => {
            setSelasaModalDelete(null);
          }}
        >
          <DeleteSelasa
            hari={selasaModalDelete.hari}
            ruang={selectNamaRuang}
            sesi={selasaModalDelete.sesi.nama_sesi}
            idRuang={selectedRuangIdPass}
            jadwalId={selasaModalDelete.id}
            onClose={() => setSelasaModalDelete(null)}
            onSuccess={() => { }}
          />
        </ModalDetail>
      ) : rabuModalDelete ? (
        <ModalDetail
          titleModal="Hapus Jadwal"
          onClose={() => {
            setRabuModalDelete(null);
          }}
        >
          <DeleteRabu
            hari={rabuModalDelete.hari}
            ruang={selectNamaRuang}
            sesi={rabuModalDelete.sesi.nama_sesi}
            idRuang={selectedRuangIdPass}
            jadwalId={rabuModalDelete.id}
            onClose={() => setRabuModalDelete(null)}
            onSuccess={() => { }}
          />
        </ModalDetail>
      ) : kamisModalDelete ? (
        <ModalDetail
          titleModal="Hapus Jadwal"
          onClose={() => {
            setKamisModalDelete(null);
          }}
        >
          <DeleteKamis
            hari={kamisModalDelete.hari}
            ruang={selectNamaRuang}
            sesi={kamisModalDelete.sesi.nama_sesi}
            idRuang={selectedRuangIdPass}
            jadwalId={kamisModalDelete.id}
            onClose={() => setKamisModalDelete(null)}
            onSuccess={() => { }}
          />
        </ModalDetail>
      ) : jumatModalDelete ? (
        <ModalDetail
          titleModal="Hapus Jadwal"
          onClose={() => {
            setJumatModalDelete(null);
          }}
        >
          <DeleteJumat
            hari={jumatModalDelete.hari}
            ruang={selectNamaRuang}
            sesi={jumatModalDelete.sesi.nama_sesi}
            idRuang={selectedRuangIdPass}
            jadwalId={jumatModalDelete.id}
            onClose={() => setJumatModalDelete(null)}
            onSuccess={() => { }}
          />
        </ModalDetail>
      ) : sabtuModalDelete ? (
        <ModalDetail
          titleModal="Hapus Jadwal"
          onClose={() => {
            setSabtuModalDelete(null);
          }}
        >
          <DeleteSabtu
            hari={sabtuModalDelete.hari}
            ruang={selectNamaRuang}
            sesi={sabtuModalDelete.sesi.nama_sesi}
            idRuang={selectedRuangIdPass}
            jadwalId={sabtuModalDelete.id}
            onClose={() => setSabtuModalDelete(null)}
            onSuccess={() => { }}
          />
        </ModalDetail>
      ) : mingguModalDelete ? (
        <ModalDetail
          titleModal="Hapus Jadwal"
          onClose={() => {
            setMingguModalDelete(null);
          }}
        >
          <DeleteMinggu
            hari={mingguModalDelete.hari}
            ruang={selectNamaRuang}
            sesi={mingguModalDelete.sesi.nama_sesi}
            idRuang={selectedRuangIdPass}
            jadwalId={mingguModalDelete.id}
            onClose={() => setMingguModalDelete(null)}
            onSuccess={() => { }}
          />
        </ModalDetail>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Jadwal;
