import { FC, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";

interface CreateKelompokProps {
  onClose: () => void;
  onSucsess: () => void;
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

type FormData = yup.InferType<typeof schema>;

const CreateKelompok: FC<CreateKelompokProps> = ({ onClose, onSucsess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: program, error: errorprogram } = useSWR<any[]>(
    "/api/program",
    fetcher
  );

  const {
    register,
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
      <div className="">
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
          className={`mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
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
          // label ketika loading true maka labelnya jadi loading
          label={
            isLoading ? (
              <div className="flex gap-1 items-center">
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
