import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface RuangEditProps {
  ruangId: string;
  data: any;
  onClose: () => void;
}

const schema = yup.object().shape({
  nama_ruang: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama ruang minimal 3 karakter"),
  tipe: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const RuangEdit: FC<RuangEditProps> = ({ ruangId, onClose, data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama_ruang, tipe } = data;

    setIsLoading(true); // Set loading state to true

    try {
      await axios.put(`/api/ruang/${ruangId}`, {
        nama_ruang,
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

  const [isListOpenTipe, setIsListOpenTipe] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

  const tipeOptions = [
    { value: "KELAS", label: "KELAS" },
    { value: "RUMAH", label: "RUMAH" },
  ];

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenTipe(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenTipe, componentRef]);

  const toggleListTipe = () => {
    setIsListOpenTipe(!isListOpenTipe);
  };

  const selectTipe = (tipe: string) => {
    setValue("tipe", tipe);
    setIsListOpenTipe(false);
  };

  const getTipeLabel = (value: string) => {
    const option = tipeOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  const tipeLabel =
    data?.tipe === "KELAS"
      ? "KELAS"
      : data?.tipe === "RUMAH"
      ? "RUMAH"
      : "Pilih Tipe";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <>
        <div className="form-group">
          <Input
            id="nama_ruang"
            label="Nama Ruang"
            errors={errors}
            register={{ ...register("nama_ruang") }}
            defaultValue={data?.nama_ruang ?? ""}
          />
          {errors.nama_ruang && (
            <p className="text-red-500">{errors.nama_ruang.message}</p>
          )}{" "}
        </div>

        {/* selected ruang */}
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm text-Primary-10">
            Tipe
          </label>

          <div className="relative flex flex-col gap-2">
            <button
              type="button"
              className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
                isListOpenTipe
                  ? "border-[2px] border-Primary-50 bg-Primary-95"
                  : "bg-Neutral-95"
              }`}
              onClick={toggleListTipe}
            >
              {getTipeLabel(watch("tipe") ?? "") || tipeLabel}
              {isListOpenTipe ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            {isListOpenTipe && (
              <ul
                className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                ref={componentRef}
              >
                {tipeOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      className={`w-full text-left px-2 py-1 rounded-full ${
                        watch("tipe") === option.value
                          ? "text-Primary-90 bg-Primary-20"
                          : "text-Primary-20 hover:bg-Primary-95"
                      }`}
                      onClick={() => selectTipe(option.value)}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.tipe && (
            <span className="text-red-500">{errors.tipe.message}</span>
          )}
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
                "Konfirmasi"
              )
            }
            textColor="text-Neutral-100"
            type="submit"
            withBgColor
          />
        </div>
      </>
    </form>
  );
};

export default RuangEdit;
