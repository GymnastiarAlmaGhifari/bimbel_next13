import { FC, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import TimePicker from "@/pages/components/TimePicker";
// import { format } from 'date-fns';

interface SesiEditProps {
  sesiId: string;
  data: any;
  onClose: () => void;
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

const SesiEdit: FC<SesiEditProps> = ({ sesiId, onClose, data }) => {
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      await axios.put(`/api/sesi/${sesiId}`, {
        nama_sesi,
        jam_mulai,
        jam_selesai,
      });

      mutate("/api/sesi");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      onClose(); // Set loading state to false
    }
  };

  const handleTimeChange = (hour: number, minute: number) => {
    console.log(`Selected time: ${hour}:${minute}`);
    // Lakukan apa pun dengan nilai jam dan menit yang dipilih
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <>
        <div className="form-group flex flex-col gap-4">
          <Input
            id="nama_sesi"
            label="Nama Sesi"
            errors={errors}
            register={{ ...register("nama_sesi") }}
            defaultValue={data?.nama_sesi ?? ""}
          />
          <div className="flex gap-4">
            {/* <TimePicker label="Jam Mulai" onTimeChange={handleTimeChange} />

                  label="Jam Selesai"
                  onTimeChange={handleTimeChange}
                /> */}
          </div>
          <Input
            id="jam_mulai"
            label="Jam Mulai"
            type="time"
            errors={errors}
            register={{ ...register("jam_mulai") }}
            defaultValue={data?.jam_mulai ?? ""}
          />
          <Input
            id="jam_selesai"
            label="Jam Selesai"
            type="time"
            errors={errors}
            register={{ ...register("jam_selesai") }}
            defaultValue={data?.jam_selesai ?? ""}
          />
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
            bgColor="bg-Tertiary-50"
            brColor=""
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
            type="submit"
            withBgColor
          />
          {/* <button type="submit" className="btn btn-primary btn-block">
                Simpan
              </button> */}
        </div>
      </>
    </form>
  );
};

export default SesiEdit;
