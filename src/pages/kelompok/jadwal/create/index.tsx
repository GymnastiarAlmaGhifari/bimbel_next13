import { yupResolver } from "@hookform/resolvers/yup";
import React, { FC, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type TambahJadwalProps = {};

const TambahJadwal: FC<TambahJadwalProps> = ({}) => {
  const [isListOpenHari, setIsListOpenHari] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isListOpenLevel, setIsListOpenLevel] = useState(false);
  const [isListOpenTipe, setIsListOpenTipe] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

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
  const tipeOptions = [
    { value: "PRIVATE", label: "PRIVATE" },
    { value: "SEMI_PRIVATE", label: "SEMI PRIVATE" },
    { value: "KELOMPOK", label: "KELOMPOK" },
  ];

  const levelOptions = [
    { value: "PREMIUM", label: "PREMIUM" },
    { value: "REGULER", label: "REGULER" },
  ];
  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenHari(false);
        setIsListOpenLevel(false);
        setIsListOpenTipe(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenHari, setIsListOpenLevel, setIsListOpenTipe, componentRef]);

  const toggleListHari = () => {
    setIsListOpenHari(!isListOpenHari);
  };

  const toggleListLevel = () => {
    setIsListOpenLevel(!isListOpenLevel);
  };

  const toggleListTipe = () => {
    setIsListOpenTipe(!isListOpenTipe);
  };

  const selectHari = (hari: string) => {
    setValue("hari", hari);
    setIsListOpenHari(false);
  };
  const selectlevel = (level: string) => {
    setValue("level", level);
    setIsListOpenLevel(false);
  };
  const selectTipe = (tipe: string) => {
    setValue("tipe", tipe);
    setIsListOpenTipe(false);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name, email, password, role, nomor_telepon, alamat } = data;

    setIsLoading(true); // Set loading state to true
    setError(null);

    try {
      await axios.post(`/api/user`, {
        name,
        email,
        password,
        role,
        nomor_telepon,
        alamat,
      });

      mutate("/api/user");
      mutate(`/api/userimg`);
      mutate(`/api/user/getadmin`);
      onClose(); // Set loading state to false
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

          setError(`An error occurred: ${errorMessage}`);
        } else if (axiosError.request) {
          console.log("No response received:", axiosError.request);

          const request = axiosError.request.toString();
          setError(`No response received: ${request}`);
        } else {
          console.log("Error setting up the request:", axiosError.message);

          const request = axiosError.message.toString();
          setError(`Error setting up the request: ${request}`);
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
    const option = levelOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };
  const getLevelLabel = (value: string) => {
    const option = levelOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  const getTipeLabel = (value: string) => {
    const option = tipeOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  return (
    <form>
      <div className="flex flex-col gap-2">
        <label htmlFor="" className="text-sm text-Primary-10">
          Level
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
            {getHariLabel(watch("hari")) || "Pilih Role"}
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
    </form>
  );
};

export default TambahJadwal;
