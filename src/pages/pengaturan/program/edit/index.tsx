import { FC, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import Button from "@/pages/components/buttons/Button";

interface ProgramEditProps {
  programId: string;
  data: any;
  onClose: () => void;
}

interface Kelas {
  id: string;
  nama_kelas: string;
}

const schema = yup.object().shape({
  nama_program: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama program minimal 3 karakter"),
  level: yup.string().test({
    name: "Pilih level",
    message: "Pilih level dahulu",
    test: (value) => value !== "" && value !== "Pilih level",
  }),
  tipe: yup.string().test({
    name: "Pilih tipe",
    message: "Pilih tipe dahulu",
    test: (value) => value !== "" && value !== "Pilih tipe",
  }),
  kelas_id: yup.string().test({
    name: "Pilih kelas",
    message: "Pilih kelas dahulu",
    test: (value) => value !== "" && value !== "Pilih kelas",
  }),
});

type FormData = yup.InferType<typeof schema>;

const ProgramEdit: FC<ProgramEditProps> = ({ programId, onClose, data }) => {
  const { data: kelas, error } = useSWR<Kelas[]>("/api/kelas", fetcher);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama_program, level, tipe, kelas_id } = data;

    setIsLoading(true); // Set loading state to true

    try {
      await axios.put(`/api/program/${programId}`, {
        nama_program,
        level,
        tipe,
        kelas_id,
      });

      mutate("/api/program");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      onClose(); // Set loading state to false
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <>
        {isLoading && <div className="loader">Loading...</div>}

        {!isLoading && (
          <>
            <div className="form-group">
              <Input
                id="nama_program"
                label="Nama Program"
                defaultValue={data?.nama_program ?? ""}
                errors={errors}
                register={{ ...register("nama_program") }}
              />
              {errors.nama_program && (
                <span className="text-danger">
                  {errors.nama_program.message}
                </span>
              )}
            </div>

            <div className="">
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700"
              >
                Kelas
              </label>
              <select
                id="level"
                autoComplete="level"
                {...register("level")}
                defaultValue={data?.level ?? ""}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Pilih Level</option>
                <option value="PREMIUM">Premium</option>
                <option value="REGULER">reguler</option>
              </select>
              {errors.level && (
                <span className="text-Error-50">{errors.level.message}</span>
              )}
            </div>

            <div className="">
              <label
                htmlFor="tipe"
                className="block text-sm font-medium text-gray-700"
              >
                Kelas
              </label>
              <select
                id="tipe"
                autoComplete="tipe"
                {...register("tipe")}
                defaultValue={data?.tipe ?? ""}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Pilih Tipe</option>
                <option value="PRIVATE">Private</option>
                <option value="SEMI_PRIVATE">Semi Private</option>
                <option value="KELOMPOK">Kelompok</option>
              </select>
              {errors.tipe && (
                <span className="text-Error-50">{errors.tipe.message}</span>
              )}
            </div>

            <div className="">
              <label
                htmlFor="kelas_id"
                className="block text-sm font-medium text-gray-700"
              >
                Kelas
              </label>
              <select
                id="kelas_id"
                autoComplete="kelas_id"
                {...register("kelas_id")}
                defaultValue={data?.kelas_id ?? ""}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Pilih Kelas</option>
                {kelas?.map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.nama_kelas}
                  </option>
                ))}
              </select>
              {errors.kelas_id && (
                <p className="text-Error-40">{errors.kelas_id.message}</p>
              )}
            </div>

            <div className="flex flex-row gap-4 justify-end">
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
                bgColor="bg-Tertiary-50"
                brColor=""
                label="Konfirmasi"
                textColor="text-Neutral-100"
                type="submit"
                withBgColor
              />
              {/* <button type="submit" className="btn btn-primary btn-block">
                Simpan
              </button> */}
            </div>
          </>
        )}
      </>
    </form>
  );
};

export default ProgramEdit;
