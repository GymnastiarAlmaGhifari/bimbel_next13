import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";

interface RekeningEditProps {
  rekeningId?: string;
  data: any;
  onSucsess: () => void;
  onClose: () => void;
}

const schema = yup.object().shape({
  nama_rekening: yup.string().required(),
  nomor_rekening: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;

const RekeningEdit: FC<RekeningEditProps> = ({
  rekeningId,
  data,
  onSucsess,
  onClose,
}) => {
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
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    const { nama_rekening, nomor_rekening } = data;

    try {
      await axios.put(`/api/rekening/${rekeningId}`, {
        nama_rekening,
        nomor_rekening,
      });
      mutate(`/api/rekening`);

      onSucsess();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      onClose();
      onSucsess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
      <Input
        id="nama_rekening"
        label="Nama Rekening"
        defaultValue={data?.nama_rekening}
        errors={errors}
        type="text"
        register={{ ...register("nama_rekening") }}
      />
      {errors.nama_rekening && (
        <p className="text-red-500">{errors.nama_rekening.message}</p>
      )}
      <Input
        id="nomor_rekening"
        label="Nomor Rekening"
        defaultValue={data?.nomor_rekening}
        errors={errors}
        type="number"
        register={{ ...register("nomor_rekening") }}
      />
      {errors.nomor_rekening && (
        <p className="text-red-500">{errors.nomor_rekening.message}</p>
      )}
      <div className="flex justify-end">
        <Button
          center
          type="submit"
          bgColor="bg-Tertiary-50"
          brColor=""
          // label ketika loading true maka labelnya jadi loading
          label={isLoading ? "Loading..." : "Simpan"}
          textColor="text-Neutral-100"
          withBgColor
          disabled={isLoading} // Disable the button when loading is true
        />
      </div>
    </form>
  );
};

export default RekeningEdit;
