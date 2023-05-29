import { yupResolver } from "@hookform/resolvers/yup";
import React, { FC, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios, { AxiosError } from "axios";
import * as yup from "yup";
import useSWR, { mutate } from "swr";
import CardAnggotaJadwal from "@/pages/components/card/CardAnggotaJadwal";
import Button from "@/pages/components/buttons/Button";
import fetcher from "@/libs/fetcher";

interface TambahJadwalProps {
  onClose: () => void;
  onSucsess: () => void;
  data: any;
  kelompokId: string;
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
  hari: yup.string().required(),
  sesi: yup.string().required(),
  ruang: yup.string().required(),
  mapel: yup.string().required(),
  userCheck: yup
    .mixed()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === "") {
        return null; // Mengubah string kosong menjadi nilai null
      }
      return originalValue;
    }),
});

type FormData = yup.InferType<typeof schema>;

const TambahJadwal: FC<TambahJadwalProps> = ({
  onClose,
  onSucsess,
  kelompokId,
  data,
}) => {
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

  const [isListOpenHari, setIsListOpenHari] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isListOpenSesi, setIsListOpenSesi] = useState(false);
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

  watch("userCheck");

  const hariOptions = [
    { value: "SENIN", label: "Senin" },
    { value: "SELASA", label: "Selasa" },
    { value: "RABU", label: "Rabu" },
    { value: "KAMIS", label: "Kamis" },
    { value: "JUMAT", label: "Jumat" },
    { value: "SABTU", label: "Sabtu" },
    { value: "MINGGU", label: "Minggu" },
  ];

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenHari(false);
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
  }, [
    setIsListOpenHari,
    setIsListOpenSesi,
    setIsListOpenRuang,
    setIsListOpenMapel,
    componentRef,
  ]);

  const [checkValueUser, setCheckValueUser] = useState<string>("");
  const [selectedOptionUser, setSelectedOptionUser] = useState<User | null>(
    null
  );
  let filteredUser = user;

  if (checkValueUser) {
    filteredUser = user?.filter((userItem) => {
      return userItem.mapel_id === checkValueUser; // Add 'return' statement
    });
  }

  const handleCheckChangeUser = (value: string) => {
    setCheckValueUser(value);
  };

  const toggleListHari = () => {
    setIsListOpenHari(!isListOpenHari);
  };

  const toggleListSesi = () => {
    setIsListOpenSesi(!isListOpenSesi);
  };

  const toggleListRuang = () => {
    setIsListOpenRuang(!isListOpenRuang);
  };

  const toggleListMapel = () => {
    setIsListOpenMapel(!isListOpenMapel);
  };

  const selectHari = (hari: string) => {
    setValue("hari", hari);
    setIsListOpenHari(false);
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { sesi, mapel, ruang, hari } = data;

    let { userCheck } = data;
    if (Array.isArray(userCheck)) {
      userCheck = userCheck[0].toString();
    }

    setIsLoading(true); // Set loading state to true
    setError(null);

    const payload = {
      kelompok_id: kelompokId,
      user_id: userCheck,
      hari: hari,
      sesi_id: sesi,
      mapel_id: mapel,
      ruang_id: ruang,
    };

    try {
      await axios.post(`/api/jadwaldetail/`, {
        ...payload,
      });

      mutate(`/api/jadwaldetail/`, undefined);
      mutate(`/api/kelompok/jadwal/${kelompokId}`, undefined);
      onClose(); // Set loading state to false
      onSucsess();
    } catch (error: any) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.log("Response data:", axiosError.response.data);
          console.log("Response status:", axiosError.response.status);

          const responseData = axiosError.response.data as { message: string };

          // Extract the main error message from the response data
          const errorMessage = responseData.message;

          setError(`${errorMessage}`);
        } else if (axiosError.request) {
          console.log(axiosError.request);

          const request = axiosError.request.toString();
          setError(request);
        } else {
          console.log(axiosError.message);

          const request = axiosError.message.toString();
          setError(request);
        }
      } else {
        console.log("Error:", error.message);
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const getHariLabel = (value: string) => {
    const option = hariOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="text-red-500 text-sm font-semibold">{error}</div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="" className="text-sm text-Primary-10">
          Hari
        </label>

        <div className="relative flex flex-col gap-2">
          <button
            type="button"
            className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
              isListOpenHari
                ? "border-[2px] border-Primary-50 bg-Primary-95"
                : "bg-Neutral-95"
            }`}
            onClick={toggleListHari}
          >
            {getHariLabel(watch("hari")) || "Pilih Hari"}
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
                    className={`w-full text-left px-2 py-1 rounded-full ${
                      watch("hari") === option.value
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
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-sm text-Primary-10">
            Sesi
          </label>

          <div className="relative flex flex-col gap-2">
            <button
              type="button"
              className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
                isListOpenHari
                  ? "border-[2px] border-Primary-50 bg-Primary-95"
                  : "bg-Neutral-95"
              }`}
              onClick={toggleListSesi}
            >
              {watch("sesi") ? (
                sesi?.find((item) => item.id === watch("sesi"))?.nama_sesi
              ) : (
                <span className="text-Primary-20">Pilih Sesi</span>
              )}
              {isListOpenSesi ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            {isListOpenSesi && (
              <ul
                className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                ref={componentRef}
              >
                {errorSesi ? (
                  <li>Error Fetching Data</li>
                ) : !sesi ? (
                  <li>Loading...</li>
                ) : sesi.length === 0 ? (
                  <li>No Data</li>
                ) : (
                  sesi.map((option) => (
                    <li key={option.id}>
                      <button
                        type="button"
                        className={`w-full text-left px-2 py-1 rounded-full ${
                          watch("hari") === option.id
                            ? "text-Primary-90 bg-Primary-20"
                            : "text-Primary-20 hover:bg-Primary-95"
                        }`}
                        onClick={() => selectSesi(option.id)}
                      >
                        {option.nama_sesi}
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
                isListOpenHari
                  ? "border-[2px] border-Primary-50 bg-Primary-95"
                  : "bg-Neutral-95"
              }`}
              onClick={toggleListRuang}
            >
              {watch("ruang") ? (
                ruang?.find((item) => item.id === watch("ruang"))?.nama_ruang
              ) : (
                <span className="text-Primary-20">Pilih Ruang</span>
              )}
              {isListOpenRuang ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            {isListOpenRuang && (
              <ul
                className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                ref={componentRef}
              >
                {errorRuang ? (
                  <li>Error Fetching Data Ruang</li>
                ) : !ruang ? (
                  <li>Loading...</li>
                ) : ruang.length === 0 ? (
                  <li>No Data Ruang</li>
                ) : (
                  ruang?.map((option) => (
                    <li key={option.id}>
                      <button
                        type="button"
                        className={`w-full text-left px-2 py-1 rounded-full ${
                          watch("ruang") === option.id
                            ? "text-Primary-90 bg-Primary-20"
                            : "text-Primary-20 hover:bg-Primary-95"
                        }`}
                        onClick={() => selectRuang(option.id)}
                      >
                        {option.nama_ruang}
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
      <div className="flex flex-col gap-1">
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
            {watch("mapel") ? (
              mapel?.find((item) => item.id === watch("mapel"))?.nama_mapel
            ) : (
              <span className="text-Primary-20">Pilih Mapel</span>
            )}
            {isListOpenMapel ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {isListOpenMapel && (
            <ul
              className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
              ref={componentRef}
            >
              {errorMapel ? (
                <li>Error Fetching Data Mapel</li>
              ) : !mapel ? (
                <li>Loading...</li>
              ) : mapel.length === 0 ? (
                <li>No Data Mapel</li>
              ) : (
                mapel.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      className={`w-full text-left px-2 py-1 rounded-full ${
                        watch("mapel") === option.id
                          ? "text-Primary-90 bg-Primary-20"
                          : "text-Primary-20 hover:bg-Primary-95"
                      }`}
                      onClick={() => {
                        selectMapel(option.id);
                        handleCheckChangeUser(option.id);
                      }}
                    >
                      {option.nama_mapel}
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
      <p className="font-semibold text-lg text-Primary-20">Pilih Tentor</p>
      <div className="h-80 overflow-auto scrollbar pr-2">
        <div className="grid grid-cols-6 gap-4 w-full">
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
              }}
              setValue={setValue}
              getValues={getValues}
              groupName="kelompokCheck"
              label={item.name}
              nomor_telepon={item.mapel?.nama_mapel}
            />
          ))}
          {errors.userCheck && <p>{errors.userCheck.message}</p>}
        </div>
      </div>
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
          label={
            isLoading ? (
              <div className="flex gap-2 items-center">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]"></div>
                <span>Loading</span>
              </div>
            ) : (
              "Konfirmasi"
            )
          }
          textColor="text-Neutral-100"
          withBgColor
        />
      </div>
    </form>
  );
};

export default TambahJadwal;
