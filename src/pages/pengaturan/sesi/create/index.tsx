import { FC, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";

interface RuangCreateProps {
  onClose: () => void;
  onSucsess: () => void;
}

const schema = yup.object().shape({
  nama_sesi: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama sesi minimal 3 karakter"),
  jam_mulai: yup.string().required("tidak boleh kosong"),
  jam_selesai: yup.string().required("tidak boleh kosong"),
});

type FormData = yup.InferType<typeof schema>;

const Create: FC<RuangCreateProps> = ({ onClose, onSucsess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama_sesi, jam_mulai, jam_selesai } = data;

    setIsLoading(true); // Set loading state to true
    setIsLoading(true); // Set loading state to true
    setError(null);

    try {
      await axios.post(`/api/sesi`, {
        nama_sesi,
        jam_mulai,
        jam_selesai,
      });

      mutate("/api/sesi");
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
        id="nama_sesi"
        label="Nama Sesi"
        type="text"
        register={{ ...register("nama_sesi") }}
        errors={errors}
      />
      {errors.nama_sesi && (
        <p className="text-red-500">{errors.nama_sesi.message}</p>
      )}

      <Input
        id="jam_mulai"
        label="Jam Mulai"
        type="time"
        register={{ ...register("jam_mulai") }}
        errors={errors}
      />
      {errors.jam_mulai && (
        <p className="text-red-500">{errors.jam_mulai.message}</p>
      )}

      <Input
        id="jam_selesai"
        label="Jam Selesai"
        type="time"
        register={{ ...register("jam_selesai") }}
        errors={errors}
      />
      {errors.jam_selesai && (
        <p className="text-red-500">{errors.jam_selesai.message}</p>
      )}

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

export default Create;
