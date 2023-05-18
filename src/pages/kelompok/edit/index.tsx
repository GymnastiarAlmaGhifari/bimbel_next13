import { FC, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import Image from "next/image";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";

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
  jadwal_id: yup.string().required(),
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

  const { data: jadwal, error: errorJadwal } = useSWR<any[]>(
    "/api/jadwal",
    fetcher
  );

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama_kelompok, program_id, jadwal_id } = data;

    setIsLoading(true); // Set loading state to true
    try {
      await axios.put(`/api/kelompok/${kelompokId}`, {
        nama_kelompok,
        program_id,
        jadwal_id,
      });
      mutate("/api/kelompok");
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

                <div className="">
                  <label
                    htmlFor="program_id"
                    className="block text-sm text-gray-700"
                  >
                    Program
                  </label>
                  <select
                    id="program_id"
                    autoComplete="program_id"
                    {...register("program_id")}
                    defaultValue={data?.program_id ?? ""}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-Primary-50 focus:border-Primary-50 sm:text-sm appearance-none rounded-full"
                  >
                    {program?.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.nama_program}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="">
                  <label
                    htmlFor="jadwal_id"
                    className="block text-sm text-gray-700"
                  >
                    Jadwal
                  </label>
                  <select
                    id="jadwal_id"
                    autoComplete="jadwal_id"
                    {...register("jadwal_id")}
                    defaultValue={data?.jadwal_id ?? ""}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white\ shadow-sm focus:outline-none focus:ring-1 focus:ring-Primary-50 focus:border-Primary-50 sm:text-sm appearance-none rounded-full"
                  >
                    {jadwal?.map((jadwal) => (
                      <option key={jadwal.id} value={jadwal.id}>
                        {jadwal.nama}
                      </option>
                    ))}
                  </select>
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
                  label="Konfirmasi"
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
