import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import { IoMdCloudUpload, IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import { MdModeEdit } from "react-icons/md";

interface GajiEdit {
  gajiId?: string;
  data: any;
  onClose: () => void;
  onSucsess: () => void;
}

const schema = yup.object().shape({
  gaji: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;

const GajiEdit: FC<GajiEdit> = ({ gajiId, data, onClose, onSucsess }) => {
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
  const formatRupiah = (e: any) => {
    const rawValue = e.target.value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const formattedValue = "Rp " + rawValue;
    setValue("gaji", formattedValue);
  };

  const formattedgaji = data?.jumlah_gaji
    ? data?.jumlah_gaji
        .toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })
        .replace(",00", "")
    : "";

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    const { gaji } = data;

    console.log(data);

    setIsLoading(true);

    const payload = {
      jumlah_gaji: parseInt(data.gaji.replace(/\D/g, "")),
    };

    console.log(payload);
    try {
      await axios.put(`/api/setgaji/${gajiId}`, payload);
      mutate("/api/setgaji");
      onSucsess();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      onClose();
    }

    try {
      await axios.put(`/api/setgaji/${gajiId}`, payload);
      mutate("/api/setgaji");
      onSucsess();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
      <Input
        id="gaji"
        label="Gaji"
        type="text"
        errors={errors}
        register={{ ...register("gaji") }}
        onChange={formatRupiah}
        defaultValue={formattedgaji}
      />
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
              "Konfirmasi"
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
    </form>
  );
};

export default GajiEdit;
