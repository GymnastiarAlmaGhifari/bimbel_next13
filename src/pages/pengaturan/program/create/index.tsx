import { FC, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { IoIosArrowDown, IoIosArrowUp, IoMdCloudUpload } from "react-icons/io";
import Image from "next/image";

interface RuangCreateProps {
  onClose: () => void;
  onSucsess: () => void;
}

const schema = yup.object().shape({
  nama_program: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama program minimal 3 karakter"),
  level: yup.string().required("Pilih Level Terlebih Dahulu"),
  tipe: yup.string().required("Pilih Tipe Terlebih Dahulu"),
  kelas_id: yup.string().required("Pilih Kelas Terlebih Dahulu"),
  Deskripsi: yup.string(),
  harga: yup.string().required("Amount is required"),
  image: yup.mixed().required(),
});

type FormData = yup.InferType<typeof schema> & {
  image: FileList;
};

const CreateProgram: FC<RuangCreateProps> = ({ onClose, onSucsess }) => {
  const { data: kelas, error: errorprogram } = useSWR<any[]>(
    "/api/kelas",
    fetcher
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const { nama_program, level, tipe, kelas_id, Deskripsi, harga, image } =
      data;

    setError(null);

    const rawHarga = parseInt(harga.replace(/\D/g, ""));

    const formData = new FormData();
    formData.append("image", data.image[0]);

    if (!image || image.length === 0) {
      try {
        const response = await axios.post(`/api/program`, {
          nama_program,
          tipe,
          level,
          kelas_id,
          Deskripsi,
          harga: rawHarga,
        });

        console.log("jaskjdhkjasnhd", response.data);

        mutate("/api/program");
        onClose(); // Set loading state to false
      } catch (error: any) {
        console.error(error);

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            console.log("Response data:", axiosError.response.data);
            console.log("Response status:", axiosError.response.status);

            const responseData = axiosError.response.data as {
              message: string;
            };

            // Extract the main error message from the response data
            const errorMessage = responseData.message;

            setError(`An error occurred: ${errorMessage}`);
          } else if (axiosError.request) {
            console.log("No response received:", axiosError.request);

            const request = axiosError.request.toString();
            setError(`No response received: ${request}`);
          } else {
            console.log("Error setting up the request:", axiosError.message);

            const request = axiosError.message.toString();
            setError(`Error setting up the request: ${request}`);
          }
        } else {
          console.log("Error:", error.message);
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
        onSucsess();
      }
    } else {
      try {
        const response = await axios.post(`/api/program`, {
          nama_program,
          tipe,
          level,
          kelas_id,
          Deskripsi,
          harga: rawHarga,
          img: image,
        });

        const programId = response.data.id;

        await axios.post(`/api/program/imgup`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            from: programId,
          },
        });

        mutate("/api/program");
        onClose(); // Set loading state to false
      } catch (error: any) {
        console.error(error);

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            console.log("Response data:", axiosError.response.data);
            console.log("Response status:", axiosError.response.status);

            const responseData = axiosError.response.data as {
              message: string;
            };

            // Extract the main error message from the response data
            const errorMessage = responseData.message;

            setError(`An error occurred: ${errorMessage}`);
          } else if (axiosError.request) {
            console.log("No response received:", axiosError.request);

            const request = axiosError.request.toString();
            setError(`No response received: ${request}`);
          } else {
            console.log("Error setting up the request:", axiosError.message);

            const request = axiosError.message.toString();
            setError(`Error setting up the request: ${request}`);
          }
        } else {
          console.log("Error:", error.message);
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
        onSucsess();
      }
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

  const formatRupiah = (e: any) => {
    const rawValue = e.target.value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const formattedValue = "Rp " + rawValue;
    setValue("harga", formattedValue);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-10">
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-6 overflow-clip scale-100 w-[400px]">
        {previewImage ? (
          <div className="w-full h-60 rounded-lg">
            <Image
              src={previewImage}
              alt="Gambar"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-lg"
              loader={({ src }) => `${src}?cache-control=no-store`}
            />
          </div>
        ) : (
          <div className="w-full h-60 border rounded-lg flex items-center justify-center">
            <h1 className="-pt-2">Pilih Gambar Program Landing Page</h1>
          </div>
        )}
        <div>
          <label
            htmlFor="image"
            className="bg-Primary-40 text-white px-4 py-2 mt-4 rounded cursor-pointer flex items-center justify-center space-x-2 rounded-full bg-opacity-90 hover:bg-opacity-100"
          >
            <IoMdCloudUpload size={24} />
            <span className="font-semibold">Choose File</span>
          </label>
          <input
            type="file"
            id="image"
            {...register("image", {
              required: "Gambar wajib diunggah",
              validate: {
                fileSize: (value) => {
                  const fileSize = value[0]?.size || 0;
                  if (fileSize > 2 * 1024 * 1024) {
                    return "Ukuran file maksimum adalah 2MB";
                  }
                  return true;
                },
                fileType: (value) => {
                  const fileType = value[0]?.type || "";
                  if (!["image/jpeg", "image/png"].includes(fileType)) {
                    return "Hanya mendukung format JPEG atau PNG";
                  }
                  return true;
                },
              },
            })}
            accept="image/jpeg, image/png, image/jpg"
            className="absolute w-0 h-0"
            onChange={handleImageChange}
          />
          {/* <Image  src={data?.image} alt="Gambar" width={200} height={200} /> */}
          {errors?.image && (
            <p className="text-red-500">{errors.image?.message}</p>
          )}
        </div>
      </div>
      {/* Error message */}
      <div className="flex flex-col gap-10 w-full">
        <div className="flex flex-col gap-4 w-full">
          <Input
            id="nama_program"
            label="Nama Program"
            type="text"
            register={{ ...register("nama_program") }}
            errors={errors}
          />
          {errors.nama_program && (
            <p className="text-red-500">{errors.nama_program.message}</p>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-sm text-Primary-10">
              Level
            </label>

            <div className="relative flex flex-col gap-2">
              <button
                type="button"
                className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
                  isListOpenLevel
                    ? "border-[2px] border-Primary-50 bg-Primary-95"
                    : "bg-Neutral-95"
                }`}
                onClick={toggleListLevel}
              >
                {getLevelLabel(watch("level")) || "Pilih Level"}
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
                        className={`w-full text-left px-2 py-1 rounded-full ${
                          watch("level") === option.value
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
                className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
                  isListOpenTipe
                    ? "border-[2px] border-Primary-50 bg-Primary-95"
                    : "bg-Neutral-95"
                }`}
                onClick={toggleListTipe}
              >
                {getTipeLabel(watch("tipe")) || "Pilih Tipe"}
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

          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-sm text-Primary-10">
              Kelas
            </label>

            <div className="relative flex flex-col gap-2">
              <button
                type="button"
                className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${
                  isListOpenKelas
                    ? "border-[2px] border-Primary-50 bg-Primary-95"
                    : "bg-Neutral-95"
                }`}
                onClick={toggleListKelas}
              >
                {/* buat label */}
                {watch("kelas_id") ? (
                  kelas?.find((kelasItem) => kelasItem.id === watch("kelas_id"))
                    ?.nama_kelas
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
                          className={`w-full text-left px-2 py-1 rounded-full ${
                            watch("kelas_id") === kelasItem.id
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
              type="text"
              id="harga"
              label="Harga"
              register={{ ...register("harga") }}
              errors={errors}
              onChange={formatRupiah}
            />
          </div>
          {errors.harga && (
            <span className="text-red-500">{errors.harga.message}</span>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-sm text-Primary-10">
              Deskripsi
            </label>
            <textarea
              className="w-full h-20 px-4 py-2 rounded-xl outline-none bg-Neutral-95"
              {...register("Deskripsi", { required: "Deskripsi harus diisi" })}
            />
            {errors.Deskripsi && (
              <span className="text-red-500">{errors.Deskripsi.message}</span>
            )}
          </div>
        </div>
        {/* Buat selected berisi SUPER ADMIN dan TENTOR */}
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
            disabled={isLoading}
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
      </div>
    </form>
  );
};

export default CreateProgram;
