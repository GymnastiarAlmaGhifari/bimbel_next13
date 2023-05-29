import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import fetcher from "@/libs/fetcher";
import { IoMdCloudUpload, IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { HiOutlineCheck } from "react-icons/hi";
import CardAnggotaJadwal from "@/pages/components/card/CardAnggotaJadwal";
import CardJadwalKelompok from "@/pages/components/card/CardJadwalKelompok";

interface SeninEdit {
  jadwalId: string;
  data: any;
  idRuang: string;
  onClose: () => void;
  onSucsess: () => void;
}

interface Kelompok {
  id: string;
  nama_kelompok: string;
  program: {
    id: string;
    nama_program: string;
    kelas_id: string;
  };
}

interface Sesi {
  id: string;
  nama_sesi: string;
}

interface Ruang {
  id: string;
  nama_ruang: string;
}

interface Mapel {
  id: string;
  nama_mapel: string;
  kelas: {
    id: string;
  };
}

interface User {
  id: string;
  name: string;
  mapel_id: string;
  mapel: {
    id: string;
    nama_mapel: string;
  };
}

const schema = yup.object().shape({
  kelompokCheck: yup
    .mixed()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === "") {
        return null; // Mengubah string kosong menjadi nilai null
      }
      return originalValue;
    }),
  userCheck: yup
    .mixed()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === "") {
        return null; // Mengubah string kosong menjadi nilai null
      }
      return originalValue;
    }),
  sesi: yup.string(),
  mapel: yup.string(),
  hari: yup.string(),
  ruang: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const SeninEdit: FC<SeninEdit> = ({ jadwalId, data, onClose, onSucsess, idRuang }) => {
  const { data: kelompok, error: errorKelompok } = useSWR<Kelompok[]>(
    "api/kelompok",
    fetcher,
    {}
  );
  const { data: sesi, error: errorSesi } = useSWR<Sesi[]>(
    "api/sesi",
    fetcher,
    {}
  );
  const { data: mapel, error: errorMapel } = useSWR<Mapel[]>(
    "api/mapel",
    fetcher,
    {}
  );
  const { data: ruang, error: errorRuang } = useSWR<Ruang[]>(
    "api/ruang",
    fetcher,
    {}
  );
  const { data: user, error: errorUser } = useSWR<User[]>(
    "api/user",
    fetcher,
    {}
  );

  const [isLoading, setIsLoading] = useState(false);

  const [selectedOptionUser, setSelectedOptionUser] = useState<User | null>(
    null
  );
  const [isListOpenSesi, setIsListOpenSesi] = useState(false);
  const [isListOpenHari, setIsListOpenHari] = useState(false);
  const [isListOpenRuang, setIsListOpenRuang] = useState(false);
  const [isListOpenMapel, setIsListOpenMapel] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const hariOptions = [
    { value: "SENIN", label: "Senin" },
    { value: "SELASA", label: "Selasa" },
    { value: "RABU", label: "Rabu" },
    { value: "KAMIS", label: "Kamis" },
    { value: "JUMAT", label: "Jumat" },
    { value: "SABTU", label: "Sabtu" },
    { value: "MINGGU", label: "Minggu" },
  ];

  // buat let untuk menampung data kelompokCheck yang apabila berubah akan mutate mapel sesuai dengan id kelas yang dipilih
  const [selectedOption, setSelectedOption] = useState<Kelompok | null>(null);
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  const { data: jadwalIdData, error: errorJadwalId } = useSWR(
    `/api/jadwaldetail/${jadwalId}`,
    fetcher,
    {}
);

console.log("jadawalId", jadwalId);

  watch("kelompokCheck");
  watch("userCheck");

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenSesi(false);
        setIsListOpenRuang(false);
        setIsListOpenMapel(false);
        setIsListOpenHari(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [
    setIsListOpenSesi,
    setIsListOpenRuang,
    setIsListOpenMapel,
    setIsListOpenHari,
    componentRef,
  ]);

  const [checkValue, setCheckValue] = useState<string>("");
  const [checkValueUser, setCheckValueUser] = useState<string>("");

  let filteredMapel = mapel;
  let filteredUser = user;

  if (checkValue) {
    filteredMapel = mapel?.filter((mapelItem) => {
      return mapelItem.kelas.id === checkValue; // Add 'return' statement
    });
  }

  if (checkValueUser) {
    filteredUser = user?.filter((userItem) => {
      return userItem.mapel_id === checkValueUser; // Add 'return' statement
    });
  }

  const handleCheckChangeUser = (value: string) => {
    setCheckValueUser(value);
  };

  const handleCheckChange = (value: string) => {
    setCheckValue(value);
  };

  const toggleListSesi = () => {
    setIsListOpenSesi(!isListOpenSesi);
  };

  const toggleListHari = () => {
    setIsListOpenHari(!isListOpenHari);
  };

  const toggleListRuang = () => {
    setIsListOpenRuang(!isListOpenRuang);
  };
  const toggleListMapel = () => {
    setIsListOpenMapel(!isListOpenMapel);
  };
  const selectSesi = (sesi: string) => {
    setValue("sesi", sesi);
    setIsListOpenSesi(false);
  };
  const selectRuang = (ruang: string) => {
    setValue("ruang", ruang);
    setIsListOpenRuang(false);
  };
  const selectHari = (hari: string) => {
    setValue("hari", hari);
    setIsListOpenHari(false);
  };
  const selectMapel = (mapel: string) => {
    setValue("mapel", mapel);
    setIsListOpenMapel(false);
  };

  useEffect(() => {
    setValue("ruang", idRuang);
    setValue("hari", "SENIN");
    if (data) {
      setSelectedOption(data.kelompok);
      setValue("kelompokCheck", data.kelompok?.id);
      setSelectedOptionUser(data.user);
      setValue("userCheck", data.user?.id);
      setValue("sesi", data.sesi?.id);
      setValue("mapel", data.mapel?.id);

      setKelompokTerpilih(data.kelompok?.nama_kelompok);
      setTentorTerpilih(data.user?.name);

// set handleCheckChange untuk filter mapel
if (mapel?.length && jadwalIdData?.kelompok.program.kelas_id) {
  setCheckValue(jadwalIdData?.kelompok.program.kelas_id);
} else  {
  setCheckValue(jadwalIdData?.kelompok.program.kelas_id);
}

// set handleCheckChangeUser untuk filter User
if (user?.length && jadwalIdData?.mapel_id) {
  setCheckValueUser(jadwalIdData?.mapel_id);
} else if (user?.length && jadwalIdData?.mapel_id) {
  setCheckValueUser(jadwalIdData?.mapel_id);
}
    }
  }, [kelompok, setValue, data, mapel, idRuang, user]);

  const [kelompokTerpilih, setKelompokTerpilih] = useState(
    ""
  );

  const [tentorTerpilih, setTentorTerpilih] = useState(
    ""
  );


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    let { kelompokCheck } = data;
    if (Array.isArray(kelompokCheck)) {
      kelompokCheck = kelompokCheck[0].toString();
    }

    let { userCheck } = data;
    if (Array.isArray(userCheck)) {
      userCheck = userCheck[0].toString();
    }

    const { sesi, mapel, ruang, hari } = data;
    const payload = {
      kelompok_id: kelompokCheck,
      user_id: userCheck,
      hari: hari,
      sesi_id: sesi,
      mapel_id: mapel,
      ruang_id: ruang,
    };
    console.log("jsnnnn", payload);

    setIsLoading(true);

    try {
      const response = await axios.put(
        `/api/jadwaldetail/${jadwalId}`,
        payload
      );
      console.log(response.data);

      mutate(`/api/jadwaldetail/${jadwalId}`);

      // undefined 
      mutate(`/api/jadwal/hari?hari=SENIN&ruang_id=${idRuang}`, undefined);
      mutate(`/api/jadwal/hari?hari=${hari}&ruang_id=${ruang}`, undefined);
      // not undefined
      mutate(`/api/jadwal/hari?hari=SENIN&ruang_id=${idRuang}`);
      mutate(`/api/jadwal/hari?hari=${hari}&ruang_id=${ruang}`);

      // mutate hari sebelum diubah

      onSucsess();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHariLabel = (value: any) => {
    const option = hariOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-max">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row items-center w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-3 items-center">
              <p className="font-semibold text-lg text-Primary-20">
                Pilih Kelompok
              </p>
              <span className="bg-Neutral-70 w-[1px] h-8"></span>
              <p className="font-semibold text-lg text-Primary-20">Terpilih</p>
              <h1 className="font-semibold capitalize text-lg text-Primary-99 inline-block py-1 px-4 bg-Primary-40 rounded-lg">
                {
                  kelompokTerpilih
                }
              </h1>
            </div>
            <div className="grid grid-cols-6 gap-4 min-h-max h-36 overflow-y-scroll scrollbar pr-2">

              {kelompok && kelompok.length > 0 ? (
                kelompok.map((item: Kelompok) => (
                  <CardJadwalKelompok
                    key={item.id}
                    type="checkbox"
                    value={item.id}
                    checked={selectedOption?.id === item.id}
                    register={{ ...register("kelompokCheck") }}
                    onChange={() => {
                      if (selectedOption?.id === item.id) {
                        return;
                      }
                      setSelectedOption(
                        selectedOption?.id === item.id ? null : item
                      );
                      setValue("kelompokCheck", item.id);
                      handleCheckChange(item.program.kelas_id);

                      setKelompokTerpilih(item.nama_kelompok);
                    }}
                    setValue={setValue}
                    getValues={getValues}
                    groupName="kelompokCheck"
                    label={item.nama_kelompok}
                    nomor_telepon={item.program.nama_program}
                  />
                ))
              ) : (
                <div>Data tidak tersedia.</div>
              )}
            </div>
            {errors.kelompokCheck && (
              <span className="text-sm text-red-500">
                Kelompok harus dipilih
              </span>
            )}

            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-sm text-Primary-10">
                  Hari
                </label>
                <div className="relative flex flex-col gap-2">
                  <button
                    type="button"
                    className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenHari
                      ? "border-[2px] border-Primary-50 bg-Primary-95"
                      : "bg-Neutral-95"
                      }`}
                    onClick={toggleListHari}
                  >
                    {/* isi dari watch {hari} dan isi dengan data.hari */}
                    <span className="text-Neutral-300">
                      {getHariLabel(watch("hari")) || "SeninEdit" || "Pilih Hari"}
                      {/* {getHariLabel(watch("hari")) || data?.hari || "Pilih Hari"} */}
                    </span>
                    {isListOpenHari ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                  {isListOpenHari && (
                    <ul
                      className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                      ref={componentRef}
                    >
                      {hariOptions.map((option) => (
                        <li key={option.value}>
                          <button
                            type="button"
                            className={`w-full text-left px-2 py-1 rounded-full ${watch("hari") === option.value
                              ? "text-Primary-90 bg-Primary-20"
                              : "text-Primary-20 hover:bg-Primary-95"
                              }`}
                            onClick={() => selectHari(option.value)}
                          >
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {errors.hari && (
                  <span className="text-red-500">{errors.hari.message}</span>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-sm text-Primary-10">
                  Sesi
                </label>
                <div className="relative flex flex-col gap-1">
                  <button
                    type="button"
                    className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenSesi
                      ? "border-[2px] border-Primary-50 bg-Primary-95"
                      : "bg-Neutral-95"
                      }`}
                    onClick={toggleListSesi}
                  >
                    {/* buat label */}
                    {watch("sesi") ? (
                      sesi?.find((sesiItem) => sesiItem.id === watch("sesi"))
                        ?.nama_sesi
                    ) : (
                      <span className="text-Neutral-300">Pilih Sesi</span>
                    )}
                    {isListOpenSesi ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                  {isListOpenSesi && (
                    <ul
                      className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                      ref={componentRef}
                    >
                      {errorSesi ? (
                        <li>Error fetching data</li>
                      ) : !sesi ? (
                        <li>Loading...</li>
                      ) : sesi.length === 0 ? (
                        <li>No classes available</li>
                      ) : (
                        sesi.map((sesiItem) => (
                          <li key={sesiItem.id}>
                            <button
                              type="button"
                              className={`w-full text-left px-2 py-1 rounded-full ${watch("sesi") === sesiItem.id
                                ? "text-Primary-90 bg-Primary-20"
                                : "text-Primary-20 hover:bg-Primary-95"
                                }`}
                              onClick={() => selectSesi(sesiItem.id)}
                            >
                              {sesiItem.nama_sesi}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
                {errors.sesi && (
                  <span className="text-red-500">{errors.sesi.message}</span>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-sm text-Primary-10">
                  Ruang
                </label>

                <div className="relative flex flex-col gap-2 w-full">
                  <button
                    type="button"
                    className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenRuang
                      ? "border-[2px] border-Primary-50 bg-Primary-95"
                      : "bg-Neutral-95"
                      }`}
                    onClick={toggleListRuang}
                    defaultValue={idRuang}
                  >
                    {/* buat label */}
                    {watch("ruang") ? (
                      ruang?.find(
                        (ruangItem) => ruangItem.id === watch("ruang")
                      )?.nama_ruang
                    ) : (
                      <span className="text-Neutral-300">Pilih Ruang</span>
                    )}
                    {isListOpenRuang ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                  {isListOpenRuang && (
                    <ul
                      className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                      ref={componentRef}
                    >
                      {errorRuang ? (
                        <li>Error fetching data</li>
                      ) : !ruang ? (
                        <li>Loading...</li>
                      ) : ruang.length === 0 ? (
                        <li>No classes available</li>
                      ) : (
                        ruang.map((ruangItem) => (
                          <li key={ruangItem.id}>
                            <button
                              type="button"
                              className={`w-full text-left px-2 py-1 rounded-full ${watch("ruang") === ruangItem.id
                                ? "text-Primary-90 bg-Primary-20"
                                : "text-Primary-20 hover:bg-Primary-95"
                                }`}
                              onClick={() => selectRuang(ruangItem.id)}
                            >
                              {ruangItem.nama_ruang}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
                {errors.ruang && (
                  <span className="text-red-500">{errors.ruang.message}</span>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-sm text-Primary-10">
                  Mapel
                </label>

                <div className="relative flex flex-col gap-2">
                  <button
                    type="button"
                    className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenMapel
                      ? "border-[2px] border-Primary-50 bg-Primary-95"
                      : "bg-Neutral-95"
                      }`}
                    onClick={toggleListMapel}
                  >
                    {/* buat label */}
                    {watch("mapel") ? (
                      mapel?.find(
                        (mapelItem) => mapelItem.id === watch("mapel")
                      )?.nama_mapel
                    ) : (
                      <span className="text-Neutral-300">Pilih Mapel</span>
                    )}
                    {isListOpenMapel ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                  {isListOpenMapel && (
                    <ul
                      className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                      ref={componentRef}
                    >
                      {filteredMapel?.map((mapelItem) => (
                        <li key={mapelItem.id}>
                          <button
                            type="button"
                            className={`w-full text-left px-2 py-1 rounded-full ${watch("mapel") === mapelItem.id
                              ? "text-Primary-90 bg-Primary-20"
                              : "text-Primary-20 hover:bg-Primary-95"
                              }`}
                            onClick={() => {
                              selectMapel(mapelItem.id);
                              handleCheckChangeUser(mapelItem.id);
                            }}
                          >
                            {mapelItem.nama_mapel}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {errors.mapel && (
                  <span className="text-red-500">{errors.mapel.message}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-3 items-center">
                <p className="font-semibold text-lg text-Primary-20">
                  Pilih Tentor
                </p>
                <span className="bg-Neutral-70 w-[1px] h-8"></span>
                <p className="font-semibold text-lg text-Primary-20">Terpilih</p>
                <h1 className="font-semibold capitalize text-lg text-Primary-99 inline-block py-1 px-4 bg-Primary-40 rounded-lg">
                  {tentorTerpilih}
                </h1>
              </div>
              <div className="grid grid-cols-6 gap-4 min-h-max h-80 pr-2  overflow-y-scroll scrollbar">
                {filteredUser?.map((item: User) => (
                  <CardAnggotaJadwal
                    key={item.id}
                    id={item.id}
                    value={item.id}
                    checked={selectedOptionUser?.id === item.id}
                    {...register("userCheck")}
                    onChange={() => {
                      if (selectedOptionUser?.id === item.id) {
                        // Jika item yang dipilih adalah yang saat ini dipilih, tidak melakukan apa-apa
                        return;
                      }
                      setSelectedOptionUser(
                        selectedOptionUser?.id === item.id ? null : item
                      );
                      setValue("userCheck", item.id);
                      setTentorTerpilih(item?.name);
                    }}
                    setValue={setValue}
                    getValues={getValues}
                    groupName="kelompokCheck"
                    label={item.name}
                    nomor_telepon={item.mapel?.nama_mapel}
                  />
                ))}
                {errors.kelompokCheck && <p>{errors.kelompokCheck.message}</p>}
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6" >
        <Button
          center
          bgColor="bg-Neutral-70"
          brColor=""
          label="Batal"
          textColor="text-Neutral-30"
          type="button"
          onClick={onClose}
        />
        <Button
          type="submit"
          bgColor="bg-Tertiary-50"
          brColor=""
          label="Konfirmasi"
          textColor="text-Neutral-100"
          withBgColor
        />
      </div>
    </form>
  );
};

export default SeninEdit;
