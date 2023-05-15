import { FC, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";

interface ProgramEditProps {
  programId: string;
  data: any;
  onClose: () => void;
}

const schema = yup.object().shape({
  nama_program: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama program minimal 3 karakter"),
});

type FormData = yup.InferType<typeof schema>;

const ProgramEdit: FC<ProgramEditProps> = ({ programId, onClose, data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama_program } = data;

    setIsLoading(true); // Set loading state to true

    try {
      await axios.put(`/api/program/${programId}`, {
        nama_program,
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
