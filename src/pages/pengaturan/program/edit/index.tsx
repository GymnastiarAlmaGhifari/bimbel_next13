import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import Button from "@/pages/components/buttons/Button";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

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
  level: yup.string(),
  tipe: yup.string(),
  kelas_id: yup.string(),
  harga: yup.number().required("Harga tidak boleh kosong"),
  Deskripsi: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const ProgramEdit: FC<ProgramEditProps> = ({ programId, onClose, data }) => {
  const { data: kelas, error } = useSWR<Kelas[]>("/api/kelas", fetcher);
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
    const { nama_program, level, tipe, kelas_id, harga, Deskripsi } = data;

    setIsLoading(true); // Set loading state to true

    try {
      await axios.put(`/api/program/${programId}`, {
        nama_program,
        level,
        tipe,
        kelas_id,
        harga,
        Deskripsi
      });
      mutate("/api/program");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      onClose(); // Set loading state to false
    }
  };
  const [isListOpenKelas, setIsListOpenKelas] = useState(false);
  const [isListOpenLevel, setIsListOpenLevel] = useState(false);
  const [isListOpenTipe, setIsListOpenTipe] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

  const tipeOptions = [
    { value: "PRIVATE", label: "PRIVATE" },
    { value: "SEMI_PRIVATE", label: "SEMI PRIVATE" },
    { value: "KELOMPOK", label: "KELOMPOK" },
  ];

  const levelOptions = [
    { value: "PREMIUM", label: "PREMIUM" },
    { value: "REGULER", label: "REGULER" },
  ];

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpenKelas(false);
        setIsListOpenLevel(false);
        setIsListOpenTipe(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpenKelas, setIsListOpenLevel, setIsListOpenTipe, componentRef]);

  // set kelas id dengan data kelas_id
  useEffect(() => {
    setValue("kelas_id", data?.kelas_id);
  }, [data, setValue]);


  const toggleListKelas = () => {
    setIsListOpenKelas(!isListOpenKelas);
  };

  const toggleListLevel = () => {
    setIsListOpenLevel(!isListOpenLevel);
  };

  const toggleListTipe = () => {
    setIsListOpenTipe(!isListOpenTipe);
  };

  const selectKelas = (kelas_id: string) => {
    setValue("kelas_id", kelas_id);
    setIsListOpenKelas(false);
  };
  const selectlevel = (level: string) => {
    setValue("level", level);
    setIsListOpenLevel(false);
  };
  const selectTipe = (tipe: string) => {
    setValue("tipe", tipe);
    setIsListOpenTipe(false);
  };

  const getLevelLabel = (value: string) => {
    const option = levelOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  const getTipeLabel = (value: string) => {
    const option = tipeOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  const levelLabel =
    data?.level === "PREMIUM"
      ? "PREMIUM"
      : data?.level === "REGULER"
        ? "REGULER"
        : "Pilih Level";

  const tipeLabel =
    data?.tipe === "PRIVATE"
      ? "PRIVATE"
      : data?.tipe === "SEMI_PRIVATE"
        ? "SEMI PRIVATE"
        : data?.tipe === "KELOMPOK"
          ? "KELOMPOK"
          : "Pilih Tipe";

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

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-sm text-Primary-10">
                Level
              </label>

              <div className="relative flex flex-col gap-2">
                <button
                  type="button"
                  className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenLevel
                    ? "border-[2px] border-Primary-50 bg-Primary-95"
                    : "bg-Neutral-95"
                    }`}
                  onClick={toggleListLevel}
                >
                  {getLevelLabel(watch("level") ?? "") || levelLabel}
                  {isListOpenLevel ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {isListOpenLevel && (
                  <ul
                    className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                    ref={componentRef}
                  >
                    {levelOptions.map((option) => (
                      <li key={option.value}>
                        <button
                          type="button"
                          className={`w-full text-left px-2 py-1 rounded-full ${watch("level") === option.value
                            ? "text-Primary-90 bg-Primary-20"
                            : "text-Primary-20 hover:bg-Primary-95"
                            }`}
                          onClick={() => selectlevel(option.value)}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.level && (
                <span className="text-red-500">{errors.level.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-sm text-Primary-10">
                Tipe
              </label>

              <div className="relative flex flex-col gap-2">
                <button
                  type="button"
                  className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenTipe
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
                          className={`w-full text-left px-2 py-1 rounded-full ${watch("tipe") === option.value
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

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-sm text-Primary-10">
                kelas
              </label>

              <div className="relative flex flex-col gap-2">
                <button
                  type="button"
                  className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenKelas
                    ? "border-[2px] border-Primary-50 bg-Primary-95"
                    : "bg-Neutral-95"
                    }`}
                  onClick={toggleListKelas}
                >
                  {/* buat label */}
                  {watch("kelas_id") ? (
                    kelas?.find(
                      (kelasItem) => kelasItem.id === watch("kelas_id")
                    )?.nama_kelas
                  ) : (
                    <span className="text-Neutral-300">Pilih Kelas</span>
                  )}
                  {isListOpenKelas ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {isListOpenKelas && (
                  <ul
                    className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                    ref={componentRef}
                  >
                    {error ? (
                      <li>Error fetching data</li>
                    ) : !kelas ? (
                      <li>Loading...</li>
                    ) : kelas.length === 0 ? (
                      <li>No classes available</li>
                    ) : (
                      kelas.map((kelasItem) => (
                        <li key={kelasItem.id}>
                          <button
                            type="button"
                            className={`w-full text-left px-2 py-1 rounded-full ${watch("kelas_id") === kelasItem.id
                              ? "text-Primary-90 bg-Primary-20"
                              : "text-Primary-20 hover:bg-Primary-95"
                              }`}
                            onClick={() => selectKelas(kelasItem.id)}
                          >
                            {kelasItem.nama_kelas}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
              {errors.kelas_id && (
                <span className="text-red-500">{errors.kelas_id.message}</span>
              )}
            </div>

            {/* harga */}
            <div className="flex flex-col gap-2">
              <Input
                id="harga"
                type="number"
                label="Harga"
                register={{ ...register("harga") }}
                errors={errors}
                defaultValue={data?.harga}
              />
            </div>

            {
              errors.harga && (
                <span className="text-red-500">{errors.harga.message}</span>
              )
            }

            {/* deskripsi */}
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-sm text-Primary-10">
                Deskripsi
              </label>
              <textarea
                className="w-full h-20 px-4 py-2 rounded-xl outline-none bg-Neutral-95"
                {...register("Deskripsi", { required: "Deskripsi harus diisi" })}
              ></textarea>
              {errors.Deskripsi && (
                <span className="text-red-500">{errors.Deskripsi.message}</span>
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
