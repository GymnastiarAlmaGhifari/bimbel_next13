import { FC, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface RuangCreateProps {
  onClose: () => void;
  onSucsess: () => void;
}

const schema = yup.object().shape({
    nama_program: yup
        .string()
        .required("tidak boleh kosong")
        .min(3, "nama program minimal 3 karakter"),
    level: yup.string().required("Pilih Level Terlebih Dahulu"),
    tipe: yup.string().required("Pilih Tipe Terlebih Dahulu"),
    kelas_id: yup.string().required("Pilih Kelas Terlebih Dahulu"),
    Deskripsi: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const CreateProgram: FC<RuangCreateProps> = ({ onClose, onSucsess }) => {
    const { data: kelas, error: errorprogram } = useSWR<any[]>("/api/kelas", fetcher);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { nama_program, level, tipe, kelas_id, Deskripsi } = data;

        setIsLoading(true); // Set loading state to true
        setError(null);

        try {
            await axios.post(`/api/program`, {
                nama_program,
                tipe,
                level,
                kelas_id,
                Deskripsi
            });

            mutate("/api/program");
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
            onSucsess();
        }
      } else {
        console.log("Error:", error.message);
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
      onSucsess();
    }
  };

  const [isListOpenKelas, setIsListOpenKelas] = useState(false);
  const [isListOpenLevel, setIsListOpenLevel] = useState(false);
  const [isListOpenTipe, setIsListOpenTipe] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

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
        setIsListOpenKelas(false);
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
  }, [setIsListOpenKelas, setIsListOpenLevel, setIsListOpenTipe, componentRef]);

  const toggleListKelas = () => {
    setIsListOpenKelas(!isListOpenKelas);
  };

  const toggleListLevel = () => {
    setIsListOpenLevel(!isListOpenLevel);
  };

  const toggleListTipe = () => {
    setIsListOpenTipe(!isListOpenTipe);
  };

  const selectKelas = (kelas_id: string) => {
    setValue("kelas_id", kelas_id);
    setIsListOpenKelas(false);
  };
  const selectlevel = (level: string) => {
    setValue("level", level);
    setIsListOpenLevel(false);
  };
  const selectTipe = (tipe: string) => {
    setValue("tipe", tipe);
    setIsListOpenTipe(false);
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}
      <Input
        id="nama_program"
        label="Nama Program"
        type="text"
        register={{ ...register("nama_program") }}
        errors={errors}
      />
      {errors.nama_program && (
        <p className="text-red-500">{errors.nama_program.message}</p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="" className="text-sm text-Primary-10">
          Level
        </label>

        <div className="relative flex flex-col gap-2">
          <button
            type="button"
            className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
              isListOpenLevel
                ? "border-[2px] border-Primary-50 bg-Primary-95"
                : "bg-Neutral-95"
            }`}
            onClick={toggleListLevel}
          >
            {getLevelLabel(watch("level")) || "Pilih Level"}
            {isListOpenLevel ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {isListOpenLevel && (
            <ul
              className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
              ref={componentRef}
            >
              {levelOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`w-full text-left px-2 py-1 rounded-full ${
                      watch("level") === option.value
                        ? "text-Primary-90 bg-Primary-20"
                        : "text-Primary-20 hover:bg-Primary-95"
                    }`}
                    onClick={() => selectlevel(option.value)}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.level && (
          <span className="text-red-500">{errors.level.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="" className="text-sm text-Primary-10">
          Tipe
        </label>

        <div className="relative flex flex-col gap-2">
          <button
            type="button"
            className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
              isListOpenTipe
                ? "border-[2px] border-Primary-50 bg-Primary-95"
                : "bg-Neutral-95"
            }`}
            onClick={toggleListTipe}
          >
            {getTipeLabel(watch("tipe")) || "Pilih Tipe"}
            {isListOpenTipe ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {isListOpenTipe && (
            <ul
              className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
              ref={componentRef}
            >
              {tipeOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`w-full text-left px-2 py-1 rounded-full ${
                      watch("tipe") === option.value
                        ? "text-Primary-90 bg-Primary-20"
                        : "text-Primary-20 hover:bg-Primary-95"
                    }`}
                    onClick={() => selectTipe(option.value)}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.tipe && (
          <span className="text-red-500">{errors.tipe.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="" className="text-sm text-Primary-10">
          Kelas
        </label>

        <div className="relative flex flex-col gap-2">
          <button
            type="button"
            className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
              isListOpenKelas
                ? "border-[2px] border-Primary-50 bg-Primary-95"
                : "bg-Neutral-95"
            }`}
            onClick={toggleListKelas}
          >
            {/* buat label */}
            {watch("kelas_id") ? (
              kelas?.find((kelasItem) => kelasItem.id === watch("kelas_id"))
                ?.nama_kelas
            ) : (
              <span className="text-Neutral-300">Pilih Kelas</span>
            )}
            {isListOpenKelas ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {isListOpenKelas && (
            <ul
              className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
              ref={componentRef}
            >
              {error ? (
                <li>Error fetching data</li>
              ) : !kelas ? (
                <li>Loading...</li>
              ) : kelas.length === 0 ? (
                <li>No classes available</li>
              ) : (
                kelas.map((kelasItem) => (
                  <li key={kelasItem.id}>
                    <button
                      type="button"
                      className={`w-full text-left px-2 py-1 rounded-full ${
                        watch("kelas_id") === kelasItem.id
                          ? "text-Primary-90 bg-Primary-20"
                          : "text-Primary-20 hover:bg-Primary-95"
                      }`}
                      onClick={() => selectKelas(kelasItem.id)}
                    >
                      {kelasItem.nama_kelas}
                    </button>
                    {isListOpenKelas && (
                        <ul className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1" ref={componentRef}>
                            {error ? (
                                <li>Error fetching data</li>
                            ) : !kelas ? (
                                <li>Loading...</li>
                            ) : kelas.length === 0 ? (
                                <li>No classes available</li>
                            ) : (
                                kelas.map((kelasItem) => (
                                    <li key={kelasItem.id}>
                                        <button
                                            type="button"
                                            className={`w-full text-left px-2 py-1 rounded-full ${watch("kelas_id") === kelasItem.id
                                                ? "text-Primary-90 bg-Primary-20"
                                                : "text-Primary-20 hover:bg-Primary-95"
                                                }`}
                                            onClick={() => selectKelas(kelasItem.id)}
                                        >
                                            {kelasItem.nama_kelas}
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
                {errors.kelas_id && (
                    <span className="text-red-500">{errors.kelas_id.message}</span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-sm text-Primary-10">
                    Deskripsi
                </label>
                <textarea
                    className="w-full h-20 px-4 py-2 rounded-xl outline-none bg-Neutral-95"
                    {...register("Deskripsi", { required: "Deskripsi harus diisi" })}
                />
                {errors.Deskripsi && (
                    <span className="text-red-500">{errors.Deskripsi.message}</span>
                )}
            </div>

            {/* Buat selected berisi SUPER ADMIN dan TENTOR */}
            < div className="flex flex-row justify-end" >
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

export default CreateProgram;
