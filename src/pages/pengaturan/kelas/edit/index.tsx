import { FC, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";

interface KelasEditProps {
  kelasId: string;
  data: any;
  onClose: () => void;
}

const schema = yup.object().shape({
  nama_kelas: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama kelas minimal 3 karakter"),
});

type FormData = yup.InferType<typeof schema>;

const KelasEdit: FC<KelasEditProps> = ({ kelasId, onClose, data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama_kelas } = data;

    setIsLoading(true); // Set loading state to true

    try {
      await axios.put(`/api/kelas/${kelasId}`, {
        nama_kelas,
      });

      mutate("/api/kelas");
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
        <Input
          id="nama_kelas"
          label="Nama Kelas"
          errors={errors}
          register={{ ...register("nama_kelas") }}
          defaultValue={data?.nama_kelas ?? ""}
        />
        {errors.nama_kelas && (
          <p className="text-red-500">{errors.nama_kelas.message}</p>
        )}
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
      </>
    </form>
  );
};

export default KelasEdit;
