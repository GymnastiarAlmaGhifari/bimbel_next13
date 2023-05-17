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

interface MapelEditProps {
  mapelId: string;
  data: any;
  onClose: () => void;
}

interface Kelas {
  id: string;
  nama_kelas: string;
}

const schema = yup.object().shape({
  nama_mapel: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama mapel minimal 3 karakter"),
  kelas_id: yup.string().test({
    name: "Pilih program",
    message: "Pilih program dahulu",
    test: (value) => value !== "" && value !== "Pilih program",
  }),
});

type FormData = yup.InferType<typeof schema>;

const MapelEdit: FC<MapelEditProps> = ({ mapelId, onClose, data }) => {
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
    const { nama_mapel, kelas_id } = data;

    setIsLoading(true); // Set loading state to true

    try {
      await axios.put(`/api/mapel/${mapelId}`, {
        nama_mapel,
        kelas_id,
      });

      mutate("/api/mapel");
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
                id="nama_mapel"
                label="Nama Mapel"
                register={{ ...register("nama_mapel") }}
                errors={errors}
                defaultValue={data?.nama_mapel ?? ""}
              />
              {errors.nama_mapel && (
                <p className="text-red-500">{errors.nama_mapel.message}</p>
              )}

              {/* select kelas */}
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
            </div>
            <div className="flex flex-row justify-between">
              <Button
                bgColor="bg-Error-50"
                brColor=""
                label="Hapus Pengguna"
                textColor="text-Neutral-100"
                type="button"
                withBgColor
              />
              <Button
                bgColor="bg-Tertiary-50"
                brColor=""
                label="Konfirmasi"
                textColor="text-Neutral-100"
                type="submit"
                withBgColor
              />
              {/* <button type="submit" className="btn btn-primary">
                Simpan
              </button> */}
            </div>
          </>
        )}
      </>
    </form>
  );
};

export default MapelEdit;
