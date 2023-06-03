
import { yupResolver } from "@hookform/resolvers/yup";
import React, { FC, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios, { AxiosError } from "axios";

import * as yup from "yup";
import { mutate } from "swr";
import CardAnggotaJadwal from "@/pages/components/card/CardAnggotaJadwal";
import Button from "@/pages/components/buttons/Button";

interface TambahJadwalProps {
  onClose: () => void;
}

const TambahJadwal: FC<TambahJadwalProps> = ({ onClose }) => {
  const [isListOpenHari, setIsListOpenHari] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isListOpenSesi, setIsListOpenSesi] = useState(false);
  const [isListOpenRuang, setIsListOpenRuang] = useState(false);
  const [isListOpenMapel, setIsListOpenMapel] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required("tidak boleh kosong")
      .min(3, "judul minimal 3 karakter"),
    password: yup.string().required(),
    email: yup.string().required(),
    hari: yup.string().required(),
    sesi: yup.string().required(),
    ruang: yup.string().required(),
    mapel: yup.string().required(),
    nomor_telepon: yup.string().required().max(13, "maksimal 13 karakter"),
    lulusan: yup.string(),
    alamat: yup.string().required(),
  });

  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
  const sesiOptions = [
    { value: "PRIVATE", label: "PRIVATE" },
    { value: "SEMI_PRIVATE", label: "SEMI PRIVATE" },
    { value: "KELOMPOK", label: "KELOMPOK" },
  ];

  const ruangOptions = [
    { value: "PREMIUM", label: "PREMIUM" },
    { value: "REGULER", label: "REGULER" },
  ];
  const mapelOptions = [
    { value: "MATEMATIKA", label: "MATEMATIKA" },
    { value: "INDONESIA", label: "INDONESIA" },
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
    setIsListOpenRuang(false);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name, email, password, hari, nomor_telepon, alamat } = data;

    setIsLoading(true); // Set loading state to true
    setError(null);

    try {
      await axios.post(`/api/user`, {
        name,
        email,
        password,
        hari,
        // mapel,
        // sesi,
        nomor_telepon,
        alamat,
      });

      mutate("/api/user");
      mutate(`/api/userimg`);
      mutate(`/api/user/getadmin`);
      onClose(); // Set loading state to false
    } catch (error: any) {

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {


          const responseData = axiosError.response.data as { message: string };

          // Extract the main error message from the response data
          const errorMessage = responseData.message;

          setError(`An error occurred: ${errorMessage}`);
        } else if (axiosError.request) {


          const request = axiosError.request.toString();
          setError(`No response received: ${request}`);
        } else {


          const request = axiosError.message.toString();
          setError(`Error setting up the request: ${request}`);
        }
      } else {
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
  const getSesiLabel = (value: string) => {
    const option = sesiOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  const getRuangLabel = (value: string) => {
    const option = ruangOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  const getMapelLabel = (value: string) => {
    const option = mapelOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
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
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="" className="text-sm text-Primary-10">
            Sesi
          </label>

          <div className="relative flex flex-col gap-2">
            <button
              type="button"
              className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenHari
                  ? "border-[2px] border-Primary-50 bg-Primary-95"
                  : "bg-Neutral-95"
                }`}
              onClick={toggleListSesi}
            >
              {getSesiLabel(watch("sesi")) || "Pilih Sesi"}
              {isListOpenSesi ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            {isListOpenSesi && (
              <ul
                className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                ref={componentRef}
              >
                {sesiOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      className={`w-full text-left px-2 py-1 rounded-full ${watch("hari") === option.value
                          ? "text-Primary-90 bg-Primary-20"
                          : "text-Primary-20 hover:bg-Primary-95"
                        }`}
                      onClick={() => selectSesi(option.value)}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
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
              className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenHari
                  ? "border-[2px] border-Primary-50 bg-Primary-95"
                  : "bg-Neutral-95"
                }`}
              onClick={toggleListRuang}
            >
              {getRuangLabel(watch("ruang")) || "Pilih Ruang"}
              {isListOpenRuang ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            {isListOpenRuang && (
              <ul
                className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                ref={componentRef}
              >
                {ruangOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      className={`w-full text-left px-2 py-1 rounded-full ${watch("ruang") === option.value
                          ? "text-Primary-90 bg-Primary-20"
                          : "text-Primary-20 hover:bg-Primary-95"
                        }`}
                      onClick={() => selectRuang(option.value)}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
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
            className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenMapel
                ? "border-[2px] border-Primary-50 bg-Primary-95"
                : "bg-Neutral-95"
              }`}
            onClick={toggleListMapel}
          >
            {getMapelLabel(watch("mapel")) || "Pilih Mapel"}
            {isListOpenMapel ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {isListOpenMapel && (
            <ul
              className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
              ref={componentRef}
            >
              {mapelOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`w-full text-left px-2 py-1 rounded-full ${watch("mapel") === option.value
                        ? "text-Primary-90 bg-Primary-20"
                        : "text-Primary-20 hover:bg-Primary-95"
                      }`}
                    onClick={() => selectMapel(option.value)}
                  >
                    {option.label}
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
      <p className="font-semibold text-lg text-Primary-20">Pilih Tentor</p>
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
    </form>
  );
};

export default TambahJadwal;
