import { FC, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import Button from "@/pages/components/buttons/Button";
import { IoIosArrowDown, IoIosArrowUp, IoMdCloudUpload } from "react-icons/io";
import Image from "next/image";

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
  harga: yup.string().required("Amount is required"),
  Deskripsi: yup.string(),
  image: yup.mixed().required(),
});

type FormData = yup.InferType<typeof schema> & {
  image: FileList;
};

const ProgramEdit: FC<ProgramEditProps> = ({ programId, onClose, data }) => {
  const { data: kelas, error: errorKelas } = useSWR<Kelas[]>(
    "/api/kelas",
    fetcher
  );
  const [isLoading, setIsLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama_program, level, tipe, kelas_id, harga, Deskripsi, image } =
      data;

    setIsLoading(true); // Set loading state to true

    const rawHarga = parseInt(harga.replace(/\D/g, ""));
    const formData = new FormData();
    formData.append("image", data.image[0]);
    if (!image || image.length === 0) {
      try {
        await axios.put(`/api/program/${programId}`, {
          nama_program,
          level,
          tipe,
          kelas_id,
          harga: rawHarga,
          Deskripsi,
        });
        mutate("/api/program");
        mutate(`/api/program/${programId}`);
        console.log("tanpa gambar");
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
        onClose(); // Set loading state to false
      }
    } else {
      try {
        await axios.put(`/api/program/${programId}`, {
          nama_program,
          level,
          tipe,
          kelas_id,
          harga: rawHarga,
          Deskripsi,
        });
        console.log("dengan gambar");

        await axios.post(`/api/program/imgup`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            from: programId,
          },
        });
        mutate("/api/program");
        mutate(`/api/program/${programId}`);
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
        onClose(); // Set loading state to false
      }
    }
  };
  const [isListOpenKelas, setIsListOpenKelas] = useState(false);
  const [isListOpenLevel, setIsListOpenLevel] = useState(false);
  const [isListOpenTipe, setIsListOpenTipe] = useState(false);
  const componentRef = useRef<HTMLUListElement>(null);

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

  // format rupiah pada onchange yang replace(/\D/g,''); untuk menghilangkan selain angka serta buatkan titik setiap 3 digit angka
  const formatRupiah = (e: any) => {
    const rawValue = e.target.value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const formattedValue = "Rp " + rawValue;
    setValue("harga", formattedValue);
  };

  const formattedHarga = data?.harga
    ? data?.harga
        .toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })
        .replace(",00", "")
    : "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-10">
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-6 overflow-clip scale-100 w-[400px]">
        {previewImage ? (
          <div className="w-full">
            <h1>Gambar Program Landing Page</h1>
            <Image
              src={previewImage}
              alt="Gambar"
              width={200}
              height={200}
              className="w-full h-full object-cover"
              loader={({ src }) => `${src}?cache-control=no-store`}
            />
          </div>
        ) : (
          <div>
            <Image
              src={
                data?.img
                  ? "/api/program/img?img=" + data?.img
                  : "/img/user/default.png"
              }
              alt="Gambar"
              width={200}
              height={200}
              className="w-full h-full object-cover"
              loader={({ src }) => `${src}?cache-control=no-store`}
            />
          </div>
        )}
        <div>
          <label
            htmlFor="image"
            className="bg-Primary-40 text-white px-4 py-2 mt-4 cursor-pointer flex items-center justify-center space-x-2 rounded-full bg-opacity-90 hover:bg-opacity-100"
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

      <div className="flex flex-col gap-10 w-full">
        <div className="flex flex-col gap-4 w-full">
          <Input
            id="nama_program"
            label="Nama Program"
            defaultValue={data?.nama_program ?? ""}
            errors={errors}
            register={{ ...register("nama_program") }}
          />
          {errors.nama_program && (
            <span className="text-danger">{errors.nama_program.message}</span>
          )}
        </div>

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

        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm text-Primary-10">
            kelas
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
            id="harga"
            type="text"
            label="Harga"
            register={{ ...register("harga") }}
            errors={errors}
            defaultValue={formattedHarga}
            // onchange format rupiah
            onChange={formatRupiah}
          />
        </div>

        {errors.harga && (
          <span className="text-red-500">{errors.harga.message}</span>
        )}

        {/* deskripsi */}
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm text-Primary-10">
            Deskripsi
          </label>
          <textarea
            className="w-full h-20 px-4 py-2 rounded-xl outline-none bg-Neutral-95"
            defaultValue={data?.Deskripsi ?? ""}
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
            type="submit"
            withBgColor
          />
        </div>
        {/* <button type="submit" className="btn btn-primary btn-block">
                Simpan
              </button> */}
      </div>
    </form>
  );
};

export default ProgramEdit;
