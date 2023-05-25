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
import Image from "next/image";
import CardAnggotaJadwal from "@/pages/components/card/CardAnggotaJadwal";

interface Senin {
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
}

interface User {
  id: string;
  name: string;
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
  ruang: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const Senin: FC<Senin> = ({ jadwalId, data, onClose, onSucsess, idRuang }) => {
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
  const [check, setCheck] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Kelompok | null>(null);
  const [selectedOptionUser, setSelectedOptionUser] = useState<User | null>(
    null
  );
  const [isListOpenSesi, setIsListOpenSesi] = useState(false);
  const [isListOpenRuang, setIsListOpenRuang] = useState(false);
  const [isListOpenMapel, setIsListOpenMapel] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);
  const handleCheck = () => {
    setCheck(!check);
    console.log("check" + check);
  };
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

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
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenSesi, setIsListOpenRuang, setIsListOpenMapel, componentRef]);

  const toggleListSesi = () => {
    setIsListOpenSesi(!isListOpenSesi);
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
  const selectMapel = (mapel: string) => {
    setValue("mapel", mapel);
    setIsListOpenMapel(false);
  };

  useEffect(() => {
    // Saat data di-load, centang checkbox sesuai dengan data yang ada di database
    if (data) {
      setSelectedOption(data.kelompok);
      setValue("kelompokCheck", data.kelompok?.id);
      setSelectedOptionUser(data.user);
      setValue("userCheck", data.user?.id);
      setValue("sesi", data.sesi?.id);
      setValue("mapel", data.mapel?.id);
      setValue("ruang", idRuang);
    }
  }, [kelompok, setValue, data]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    let { kelompokCheck } = data;
    if (!Array.isArray(kelompokCheck)) {
      // keluarkan dari bentuk array
      kelompokCheck = [kelompokCheck];
    }
    console.log(kelompokCheck);

    let { userCheck } = data;
    if (!Array.isArray(userCheck)) {
      // keluarkan dari bentuk array
      userCheck = [userCheck];
    }
    console.log(userCheck);

    const { sesi, mapel, ruang } = data;
    const payload = {
      kelompok_id: kelompokCheck,
      user_id: userCheck,
      sesi_id: sesi,
      mapel_id: mapel,
      ruang_id: ruang,
    };
    console.log(JSON.stringify(payload));

    // console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[1000px]">
      <h1 className="mb-4 font-semibold capitalize">{jadwalId}</h1>
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row items-center w-full">
          <div className="flex flex-col gap-4 w-full">
            <div className=" flex gap-4">
              {kelompok?.map((item: Kelompok) => (
                <label
                  key={item.id}
                  className={`flex gap-2 p-2 border-[2px] ${
                    check ? "border-Primary-40" : ""
                  } w-full rounded-lg items-center`}
                >
                  <input
                    type="checkbox"
                    value={item.id}
                    checked={selectedOption?.id === item.id}
                    {...register("kelompokCheck")}
                    onChange={() => {
                      setSelectedOption(
                        selectedOption?.id === item.id ? null : item
                      );
                      setValue("kelompokCheck", item.id);
                    }}
                    onClick={handleCheck}
                  />
                  <button
                    onClick={handleCheck}
                    value={item.id}
                    className={`p-1 h-6 w-6 rounded-full ${
                      check ? "bg-Primary-40" : "bg-Neutral-95"
                    }`}
                  >
                    {check ? (
                      <HiOutlineCheck
                        strokeWidth={3}
                        className="text-Neutral-100"
                      />
                    ) : (
                      ""
                    )}
                  </button>
                  {item.nama_kelompok} - {item.program.nama_program}
                </label>
              ))}
            </div>

            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-sm text-Primary-10">
                  Sesi
                </label>

                <div className="relative flex flex-col gap-2">
                  <button
                    type="button"
                    className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
                      isListOpenSesi
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
                              className={`w-full text-left px-2 py-1 rounded-full ${
                                watch("sesi") === sesiItem.id
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
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-sm text-Primary-10">
                  Ruang
                </label>

                <div className="relative flex flex-col gap-2">
                  <button
                    type="button"
                    className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
                      isListOpenRuang
                        ? "border-[2px] border-Primary-50 bg-Primary-95"
                        : "bg-Neutral-95"
                    }`}
                    onClick={toggleListRuang}
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
                              className={`w-full text-left px-2 py-1 rounded-full ${
                                watch("ruang") === ruangItem.id
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
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-sm text-Primary-10">
                Mapel
              </label>

              <div className="relative flex flex-col gap-2">
                <button
                  type="button"
                  className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
                    isListOpenMapel
                      ? "border-[2px] border-Primary-50 bg-Primary-95"
                      : "bg-Neutral-95"
                  }`}
                  onClick={toggleListMapel}
                >
                  {/* buat label */}
                  {watch("mapel") ? (
                    mapel?.find((mapelItem) => mapelItem.id === watch("mapel"))
                      ?.nama_mapel
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
                    {errorMapel ? (
                      <li>Error fetching data</li>
                    ) : !mapel ? (
                      <li>Loading...</li>
                    ) : mapel.length === 0 ? (
                      <li>No classes available</li>
                    ) : (
                      mapel.map((mapelItem) => (
                        <li key={mapelItem.id}>
                          <button
                            type="button"
                            className={`w-full text-left px-2 py-1 rounded-full ${
                              watch("mapel") === mapelItem.id
                                ? "text-Primary-90 bg-Primary-20"
                                : "text-Primary-20 hover:bg-Primary-95"
                            }`}
                            onClick={() => selectMapel(mapelItem.id)}
                          >
                            {mapelItem.nama_mapel}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
              {errors.mapel && (
                <span className="text-red-500">{errors.mapel.message}</span>
              )}
            </div>
            <div className="h-80 overflow-auto scrollbar pr-2">
              <div className="grid grid-cols-6 gap-4 w-full">
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
                <CardAnggotaJadwal />
              </div>
            </div>
            {user?.map((item: User) => (
              <label key={item.id} className="">
                <input
                  type="checkbox"
                  value={item.id}
                  checked={selectedOptionUser?.id === item.id}
                  {...register("userCheck")}
                  onChange={() => {
                    setSelectedOptionUser(
                      selectedOptionUser?.id === item.id ? null : item
                    );
                    setValue("userCheck", item.id);
                  }}
                />
                {item.name}
              </label>
            ))}
            {errors.kelompokCheck && <p>{errors.kelompokCheck.message}</p>}
            <div className="flex justify-end gap-4">
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
          </div>
        </div>
      </div>
    </form>
  );
};

export default Senin;
