import { FC, useEffect, useRef, useState } from "react";
import Input from "@/pages/components/inputs/Input";
import Button from "@/pages/components/buttons/Button";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosError } from "axios";
import * as yup from "yup";
import useSWR, { mutate } from "swr";
import fetcher from "@/libs/fetcher";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface UserEditProps {
  kelompokId: string;
  data: any;
  onClose: () => void;
  onSucsess: () => void;
}

const schema = yup.object().shape({
  nama_kelompok: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "judul minimal 3 karakter"),
  program_id: yup.string().required(),
});

type FormData = yup.InferType<typeof schema> & {
  image: FileList;
};

const KelompokEdit: FC<UserEditProps> = ({
  kelompokId,
  onClose,
  onSucsess,
  data,
}) => {
  const { data: program, error } = useSWR<any[]>("/api/program", fetcher);


  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [errorr, setError] = useState<string | null>(null);


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama_kelompok, program_id,} = data;

    console.log("dhjagdjhsa", data);

    setIsLoading(true); // Set loading state to true
    try {
      const res = await axios.put(`/api/kelompok/${kelompokId}`, {
        nama_kelompok,
        program_id,
              });
      mutate("/api/kelompok");

      console.log("res", res);
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
      onClose();
      onSucsess();
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
      <>
        {isLoading && <div className="loader">Loading...</div>}

        {!isLoading && (
          <>
            <div className="flex flex-col gap-10 w-full">
              <div className="flex flex-col gap-4">
                <Input
                  id="nama_kelompok"
                  label="Nama Kelompok"
                  type="text"
                  register={{ ...register("nama_kelompok") }}
                  errors={errors}
                  defaultValue={data?.nama_kelompok}
                />
                {errors.nama_kelompok && (
                  <p className="text-red-500">{errors.nama_kelompok.message}</p>
                )}

                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="text-sm text-Primary-10">
                    Program   
                  </label>

                  <div className="relative flex flex-col gap-2">
                    <button
                      type="button"
                      className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
                        isListOpenProgram
                          ? "border-[2px] border-Primary-50 bg-Primary-95"
                          : "bg-Neutral-95"
                      }`}
                      onClick={toggleListProgram}
                    >
                      {/* buat label */}
                      {watch("program_id") ? (
                        program?.find(
                          (programItem) =>
                            programItem.id === watch("program_id")
                        )?.nama_program
                      ) : (
                        <span className="text-Neutral-300">Pilih program</span>
                      )}
                      {isListOpenProgram ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
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
                                className={`w-full text-left px-2 py-1 rounded-full ${
                                  watch("program_id") === programItem.id
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
                    <span className="text-red-500">
                      {errors.program_id.message}
                    </span>
                  )}
                </div>
              </div>
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
                      <div className="flex gap-1 items-center">
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]"></div>
                        <span>Loading</span>
                      </div>
                    ) : (
                      "Simpan"
                    )
                  }
                  textColor="text-Neutral-100"
                  withBgColor
                />
              </div>
            </div>
          </>
        )}
      </>
    </form>
  );
};

export default KelompokEdit;
