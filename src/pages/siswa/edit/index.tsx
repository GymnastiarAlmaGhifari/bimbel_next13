import { FC, useState } from "react";
import axios from "axios";
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      onClose();
      onSucsess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <>
        {isLoading && <div className="loader">Loading...</div>}

        {!isLoading && (
          <>
            <div className="flex flex-col gap-4 w-full">
              <Input
                id="nama"
                label="Nama"
                type="text"
                register={{ ...register("nama") }}
                errors={errors}
                defaultValue={data?.nama}
              />
              {errors.nama && (
                <p className="text-red-500">{errors.nama.message}</p>
              )}
              <Input
                id="email"
                label="Email"
                type="email"
                register={{ ...register("email") }}
                errors={errors}
                defaultValue={data?.email}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}

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
                label="Konfirmasi"
                textColor="text-Neutral-100"
                withBgColor
              />
            </div>
          </>
        )}
      </>
    </form>
  );
};

export default EditSiswa;
