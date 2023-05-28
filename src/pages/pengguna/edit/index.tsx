import { FC, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import { IoMdCloudUpload, IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import fetcher from "@/libs/fetcher";

interface UserEditProps {
  userId: string;
  data: any;
  onClose: () => void;
  onSucsess: () => void;
}

interface Mapel {
  id: string;
  nama_mapel: string;
  kelas: {
    id: string;
  };
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "judul minimal 3 karakter"),
  email: yup.string().required(),
  role: yup.string(),
  mapel: yup.string().required(),
  nomor_telepon: yup.string().required().max(13, "maksimal 13 karakter"),
  lulusan: yup.string().max(13, "maksimal 13 karakter"),
  alamat: yup.string().required(),
  image: yup.mixed().required(),
});

type FormData = yup.InferType<typeof schema> & {
  image: FileList;
};

const UserEdit: FC<UserEditProps> = ({ userId, onClose, onSucsess, data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [isListOpen, setIsListOpen] = useState(false);

  const [isListOpenMapel, setIsListOpenMapel] = useState(false);

  const { data: session } = useSession();
  const { data: mapel, error: errorMapel } = useSWR<Mapel[]>(
    "api/mapel",
    fetcher,
    {}
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const componentRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Menangani klik di luar komponen
    const handleOutsideClick = (event: any) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsListOpen(false);
        setIsListOpenMapel(false);
      }
    };

    // Menambahkan event listener ketika komponen di-mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsListOpen, componentRef]);

  const roleOptions = [
    { value: "SUPER", label: "SUPER ADMIN" },
    { value: "ADMIN", label: "ADMIN" },
    { value: "TENTOR", label: "TENTOR" },
  ];

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

  const [checkValue, setCheckValue] = useState<string>("");
  const [checkValueUser, setCheckValueUser] = useState<string>("");


  const toggleList = () => {
    setIsListOpen(!isListOpen);
  };

  const toggleListMapel = () => {
    setIsListOpenMapel(!isListOpenMapel);
  };

  // let filteredMapel = mapel;

  // if (checkValue) {
  //   filteredMapel = mapel?.filter((mapelItem) => {
  //     return mapelItem.kelas.id === checkValue; // Add 'return' statement
  //   });
  // }

  const handleCheckChangeUser = (value: string) => {
    setCheckValueUser(value);
  };

  const selectRole = (role: string) => {
    setValue("role", role);
    setIsListOpen(false);
  };

  const selectMapel = (mapel: string) => {
    setValue("mapel", mapel);
    setIsListOpenMapel(false);
  };


  const getRoleLabel = (value: string) => {
    const option = roleOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  // set value mapel dengan data mapel yang sudah ada
  useEffect(() => {
    setValue("mapel", data?.mapel?.id);
  }, [data, setValue]);


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name, email, role, lulusan, nomor_telepon, mapel, alamat, image } = data;

    console.log(data);
    if (!image || image.length === 0) {
      // alert("Please select an image");
      // return;
      setIsLoading(true); // Set loading state to true
      // const formData = new FormData();
      // formData.append("image", data.image[0]);
      try {
        await axios.put(`/api/user/noimg/${userId}`, {
          name,
          email,
          role,
          mapel_id: mapel,
          nomor_telepon,
          universitas: lulusan,
          alamat,
        });
        mutate(`/api/user/noimg/${userId}`);
        mutate(`/api/user`);
        mutate(`/api/user/getadmin`);
      } catch (error: any) {
        console.error(error);

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            console.log("Response data:", axiosError.response.data);
            console.log("Response status:", axiosError.response.status);

            const responseData = axiosError.response.data as { message: string };

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
        onClose();
        onSucsess();
      }
    } else if (image[0].size > 2000000) {
      setError("File terlalu besar, maksimal 2MB");
      return;
    } else {
      setIsLoading(true); // Set loading state to true
      const formData = new FormData();
      formData.append("image", data.image[0]);
      try {
        await axios.post("/api/user/userimg", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            from: userId,
          },
        });
        await axios.put(`/api/user/${userId}`, {
          name,
          email,
          role,
          mapel_id: mapel,
          nomor_telepon,
          universitas: lulusan,
          alamat,
        });
        await axios.put(`/api/user/userimg/${userId}`, {});
        mutate("/api/user");
        mutate(`/api/userimg`);
        mutate(`/api/user/getadmin`);
      } catch (error: any) {
        console.error(error);

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            console.log("Response data:", axiosError.response.data);
            console.log("Response status:", axiosError.response.status);

            const responseData = axiosError.response.data as { message: string };

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
        onClose();
        onSucsess();
      }
    }
  };
  const roleLabel =
    data?.role === "SUPER"
      ? "SUPER ADMIN"
      : data?.role === "ADMIN"
        ? "ADMIN"
        : data?.role === "TENTOR"
          ? "TENTOR"
          : "Pilih peran";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-10">
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-6 overflow-clip scale-100 w-[400px]">
        {previewImage ? (
          <div className="w-full">
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
                "/api/user/img?img=" + data?.image || "/img/user/default.png"
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
            className="bg-Primary-40 text-white px-4 py-2 cursor-pointer flex items-center justify-center space-x-2 rounded-full bg-opacity-90 hover:bg-opacity-100"
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
            id="name"
            label="Nama"
            type="text"
            register={{ ...register("name") }}
            errors={errors}
            defaultValue={data?.name}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <Input
            id="email"
            label="Email"
            type="email"
            register={{ ...register("email") }}
            errors={errors}
            defaultValue={data?.email}
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-sm text-Primary-10">
              Role
            </label>

            <div className="relative flex flex-col gap-2">
              <button
                type="button"
                className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpen
                  ? "border-[2px] border-Primary-50 bg-Primary-95"
                  : "bg-Neutral-95"
                  }`}
                onClick={toggleList}
              >
                {getRoleLabel(watch("role") ?? "") || roleLabel}
                {isListOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {isListOpen && (
                <ul
                  className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                  ref={componentRef}
                >
                  {session?.user?.role === "SUPER" &&
                    roleOptions.map((option) => (
                      <li key={option.value}>
                        <button
                          type="button"
                          className={`w-full text-left px-2 py-1 rounded-full ${watch("role") === option.value
                            ? "text-Primary-90 bg-Primary-20"
                            : "text-Primary-20 hover:bg-Primary-95"
                            }`}
                          onClick={() => selectRole(option.value)}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  {session?.user?.role === "ADMIN" &&
                    roleOptions
                      .filter((option) => option.value !== "SUPER")
                      .map((option) => (
                        <li key={option.value}>
                          <button
                            type="button"
                            className={`w-full text-left px-2 py-1 rounded-full ${watch("role") === option.value
                              ? "text-Primary-90 bg-Primary-20"
                              : "text-Primary-20 hover:bg-Primary-95"
                              }`}
                            onClick={() => selectRole(option.value)}
                          >
                            {option.label}
                          </button>
                        </li>
                      ))}
                </ul>
              )}
            </div>
            {errors.role && (
              <span className="text-red-500">{errors.role.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-sm text-Primary-10">
              Mapel
            </label>

            <div className="relative flex flex-col gap-2">
              <button
                type="button"
                className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenMapel
                  ? "border-[2px] border-Primary-50 bg-Primary-95"
                  : "bg-Neutral-95"
                  }`}
                onClick={toggleListMapel}
              >
                {/* buat label */}
                {watch("mapel") ? (
                  mapel?.find(
                    (mapelItem) => mapelItem.id === watch("mapel")
                  )?.nama_mapel
                ) : (
                  <span className="text-Neutral-300">Pilih Kelas</span>
                )}
                {isListOpenMapel ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {isListOpenMapel && (
                <ul
                  className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                  ref={componentRef}
                >
                  {error ? (
                    <li>Error fetching data</li>
                  ) : !mapel ? (
                    <li>Loading...</li>
                  ) : mapel.length === 0 ? (
                    <li>No classes available</li>
                  ) : (
                    mapel.map((mapelItem) => (
                      <li key={mapelItem.id}>
                        <button
                          type="button"
                          className={`w-full text-left px-2 py-1 rounded-full ${watch("mapel") === mapelItem.id
                            ? "text-Primary-90 bg-Primary-20"
                            : "text-Primary-20 hover:bg-Primary-95"
                            }`}
                          onClick={() => selectMapel(mapelItem.id)}
                        >
                          {mapelItem.nama_mapel}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
            {errors.mapel && (
              <span className="text-red-500">{errors.mapel.message}</span>
            )}
          </div>
          <Input
            id="nomor_telepon"
            label="Nomor Telepon"
            type="number"
            register={{ ...register("nomor_telepon") }}
            errors={errors}
            defaultValue={data?.nomor_telepon}
          />
          <Input
            id="lulusan"
            label="Lulusan"
            type="text"
            register={{ ...register("lulusan") }}
            errors={errors}
            defaultValue={data?.universitas}
          />
          <Input
            id="alamat"
            label="Alamat"
            type="text"
            register={{ ...register("alamat") }}
            errors={errors}
            defaultValue={data?.alamat}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-row justify-end gap-4">
          <Button
            center
            type="submit"
            bgColor="bg-Tertiary-50"
            brColor=""
            // label ketika loading true maka labelnya jadi loading
            label={
              isLoading ? (
                <div className="flex gap-1 items-center">
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]"></div>
                  <span>Loading</span>
                </div>
              ) : (
                "Simpan"
              )
            }
            textColor="text-Neutral-100"
            withBgColor
            disabled={isLoading} // Disable the button when loading is true
          />
        </div>
      </div>
    </form>
  );
};

export default UserEdit;
