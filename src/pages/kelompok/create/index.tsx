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

interface CreateKelompokProps {
  onClose: () => void;
  onSucsess: () => void;
  data?: any;
}

const schema = yup.object().shape({
  nama_kelompok: yup
    .string()
    .required("Tidak boleh kosong")
    .min(3, "Judul minimal 3 karakter"),
  program_id: yup.string().test({
    name: "Pilih program",
    message: "Pilih program dahulu",
    test: (value) => value !== "" && value !== "Pilih program",
  }),
});

type FormData = yup.InferType<typeof schema> & {
  image: FileList;
};

const CreateKelompok: FC<CreateKelompokProps> = ({
  onClose,
  onSucsess,
  data,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: program, error: errorprogram } = useSWR<any[]>(
    "/api/program",
    fetcher
  );

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama_kelompok, program_id } = data;

    setIsLoading(true); // Set loading state to true
    setError(null);

    try {
      await axios.post(`/api/kelompok`, {
        nama_kelompok,
        program_id,
      });

      mutate("/api/kelompok");
      mutate("/api/program");
      onClose(); // Set loading state to false
      onSucsess();
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

  const [isListOpenProgram, setIsListOpenProgram] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenProgram(false);
      }
    };
    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenProgram, componentRef]);

  useEffect(() => {
    setValue("program_id", data?.program_id);
  }, [data, setValue]);

  const toggleListProgram = () => {
    setIsListOpenProgram(!isListOpenProgram);
  };

  const selectProgram = (program_id: string) => {
    setValue("program_id", program_id);
    setIsListOpenProgram(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}
      <Input
        id="nama_kelompok"
        label="Nama Kelompok"
        type="text"
        register={{ ...register("nama_kelompok") }}
        errors={errors}
      />
      {errors.nama_kelompok && (
        <p className="text-red-500">{errors.nama_kelompok.message}</p>
      )}

      {/* select program  */}
      <div className="flex flex-col gap-2">
        <label htmlFor="" className="text-sm text-Primary-10">
          Program
        </label>

        <div className="relative flex flex-col gap-2">
          <button
            type="button"
            className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenProgram
              ? "border-[2px] border-Primary-50 bg-Primary-95"
              : "bg-Neutral-95"
              }`}
            onClick={toggleListProgram}
          >
            {/* buat label */}
            {watch("program_id") ? (
              program?.find(
                (programItem) => programItem.id === watch("program_id")
              )?.nama_program
            ) : (
              <span className="text-Neutral-300">Pilih program</span>
            )}
            {isListOpenProgram ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {isListOpenProgram && (
            <ul
              className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
              ref={componentRef}
            >
              {error ? (
                <li>Error fetching data</li>
              ) : !program ? (
                <li>Loading...</li>
              ) : program.length === 0 ? (
                <li>No classes available</li>
              ) : (
                program.map((programItem) => (
                  <li key={programItem.id}>
                    <button
                      type="button"
                      className={`w-full text-left px-2 py-1 rounded-full ${watch("program_id") === programItem.id
                        ? "text-Primary-90 bg-Primary-20"
                        : "text-Primary-20 hover:bg-Primary-95"
                        }`}
                      onClick={() => selectProgram(programItem.id)}
                    >
                      {programItem.nama_program}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        {errors.program_id && (
          <span className="text-red-500">{errors.program_id.message}</span>
        )}
      </div>
      {/* <div className="">
        <label
          htmlFor="program_id"
          className="block text-sm font-medium text-gray-700"
        >
          Program
        </label>
        <select
          id="program_id"
          autoComplete="program_id"
          {...register("program_id")}
          defaultValue=""
          className={`mt-1 block w-full py-2 px-3 border rounded-full  shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            errors.program_id ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Pilih program</option>
          {program?.map((program) => (
            <option key={program.id} value={program.id}>
              {program.nama_program}
            </option>
          ))}
        </select>
        {errors.program_id && (
          <p className="mt-1 text-sm text-red-500">
            {errors.program_id.message}
          </p>
        )}
      </div> */}

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
          // label ketika loading true maka labelnya jadi loading
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

export default CreateKelompok;
