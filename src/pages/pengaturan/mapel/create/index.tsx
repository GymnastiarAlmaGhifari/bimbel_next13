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
  nama_mapel: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama mapel minimal 3 karakter"),
  kelas_id: yup.string().required("Pilih Kelas Terlebih Dahulu"),
});

type FormData = yup.InferType<typeof schema>;

const CreateMapel: FC<RuangCreateProps> = ({ onClose, onSucsess }) => {
  const { data: kelas, error: errorprogram } = useSWR<any[]>(
    "/api/kelas",
    fetcher
  );

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
    const { nama_mapel, kelas_id } = data;

    setIsLoading(true); // Set loading state to true
    setError(null);

    try {
      await axios.post(`/api/mapel`, {
        nama_mapel,
        kelas_id,
      });

      mutate("/api/mapel");
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
  };

  const [isListOpenKelas, setIsListOpenKelas] = useState(false);

  const componentRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenKelas(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenKelas, componentRef]);

  const toggleListKelas = () => {
    setIsListOpenKelas(!isListOpenKelas);
  };

  const selectKelas = (kelas_id: string) => {
    setValue("kelas_id", kelas_id);
    setIsListOpenKelas(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}
      <Input
        id="nama_mapel"
        label="Nama Mapel"
        type="text"
        register={{ ...register("nama_mapel") }}
        errors={errors}
      />
      {errors.nama_mapel && (
        <p className="text-red-500">{errors.nama_mapel.message}</p>
      )}

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

      {/* Buat selected berisi SUPER ADMIN dan TENTOR */}
      <div className="flex flex-row justify-end gap-4">
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

export default CreateMapel;
