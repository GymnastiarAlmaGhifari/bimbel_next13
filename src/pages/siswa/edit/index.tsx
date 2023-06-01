import { FC, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import Image from "next/image";

interface UserEditProps {
  siswaId: string;
  data: any;
  onClose: () => void;
  onSucsess: () => void;
}

const schema = yup.object().shape({
  nama: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "judul minimal 3 karakter"),
  email: yup.string().required(),
  nomor_telepon: yup
    .string()
    .required()
    .max(13, "maksimal 13 karakter")
    .min(12, "minimal 12 karakter"),
  alamat: yup.string().required(),
  sekolah: yup.string().required(),
  hp_ortu: yup
    .string()
    .required()
    .max(13, "maksimal 13 karakter")
    .min(12, "minimal 12 karakter"),
});

type FormData = yup.InferType<typeof schema>;

const EditSiswa: FC<UserEditProps> = ({
  siswaId,
  onClose,
  onSucsess,
  data,
}) => {
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
    const { nama, email, hp_ortu, nomor_telepon, alamat, sekolah } = data;
    setIsLoading(true);
    setError(null);
    try {
      await axios.put(`/api/siswa/${siswaId}`, {
        nama,
        email,
        hp_ortu,
        nomor_telepon,
        sekolah,
        alamat,
      });
      mutate(`/api/siswa/${siswaId}`);
      mutate(`/api/siswa`);
      // mutate(`/api/user/getadmin`);
    } catch (error: any) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const responseData = axiosError.response.data as { message: string };

          // Extract the main error message from the response data
          const errorMessage = responseData.message;

          setError(`${errorMessage}`);
        } else if (axiosError.request) {

          const request = axiosError.request.toString();
          setError(`${request}`);
        } else {

          const request = axiosError.message.toString();
          setError(`${request}`);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {error && <p className="text-Error-50 text-sm">{error}</p>}

      <div className="flex flex-col gap-4 w-full">
        <Input
          id="nama"
          label="Nama"
          type="text"
          register={{ ...register("nama") }}
          errors={errors}
          defaultValue={data?.nama}
        />
        {errors.nama && <p className="text-red-500">{errors.nama.message}</p>}
        <Input
          id="email"
          label="Email"
          type="email"
          register={{ ...register("email") }}
          errors={errors}
          defaultValue={data?.email}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <Input
          id="nomor_telepon"
          label="Nomor Telepon"
          type="number"
          register={{ ...register("nomor_telepon") }}
          errors={errors}
          defaultValue={data?.nomor_telepon}
        />
        {errors.nomor_telepon && (
          <p className="text-red-500">{errors.nomor_telepon.message}</p>
        )}

        <Input
          id="sekolah"
          label="Sekolah"
          type="text"
          register={{ ...register("sekolah") }}
          errors={errors}
          defaultValue={data?.sekolah}
        />
        {errors.sekolah && (
          <p className="text-red-500">{errors.sekolah.message}</p>
        )}
        <Input
          id="hp_ortu"
          label="Nomor Telepon Orang Tua"
          type="number"
          register={{ ...register("hp_ortu") }}
          errors={errors}
          defaultValue={data?.hp_ortu}
        />

        {errors.hp_ortu && (
          <p className="text-red-500">{errors.hp_ortu.message}</p>
        )}
        <Input
          id="alamat"
          label="Alamat"
          type="text"
          register={{ ...register("alamat") }}
          errors={errors}
          defaultValue={data?.alamat}
        />
        {errors.alamat && (
          <p className="text-red-500">{errors.alamat.message}</p>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-row justify-end gap-4 ">
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
              "Simpan"
            )
          }
          textColor="text-Neutral-100"
          disabled={isLoading}
          withBgColor
        />
      </div>
    </form>
  );
};

export default EditSiswa;
