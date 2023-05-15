import { FC, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";

interface RuangEditProps {
  ruangId: string;
  data: any;
  onClose: () => void;
}

const schema = yup.object().shape({
  nama: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama ruang minimal 3 karakter"),
  tipe: yup.string().required("tidak boleh kosong"),
});

type FormData = yup.InferType<typeof schema>;

const RuangEdit: FC<RuangEditProps> = ({ ruangId, onClose, data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama, tipe } = data;

    setIsLoading(true); // Set loading state to true

    try {
      await axios.put(`/api/ruang/${ruangId}`, {
        nama,
        tipe,
      });

      mutate("/api/ruang");
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
                id="nama"
                label="Nama Ruang"
                errors={errors}
                register={{ ...register("nama") }}
                defaultValue={data?.nama ?? ""}
              />
              {errors.nama && (
                <p className="text-red-500">{errors.nama.message}</p>
              )}{" "}
            </div>

            {/* selected ruang */}
            <div className="">
              <label className="form-label">Tipe Ruang</label>
              <select
                className="form-select"
                {...register("tipe")}
                defaultValue={data?.tipe ?? "KELAS"}
              >
                <option value="KELAS">Kelas</option>
                <option value="RUMAH">Rumah</option>
              </select>
              {errors.tipe && (
                <p className="text-red-500">{errors.tipe.message}</p>
              )}
            </div>

            <div className="flex flex-row justify-between ">
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
              {/* <button
                                type="submit"
                                className="btn btn-primary btn-block"
                            >
                                Simpan
                            </button> */}
            </div>
          </>
        )}
      </>
    </form>
  );
};

export default RuangEdit;
