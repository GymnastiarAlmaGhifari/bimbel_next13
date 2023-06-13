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
    resolver: yupResolver(schema) as any,
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

  const handleCheckChangeUser = (value: string) => {
    setCheckValueUser(value);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {


    const { name, email, lulusan, nomor_telepon, alamat, image } = data;

    if (!image || image.length === 0) {
      // alert("Please select an image");
      // return;
      setIsLoading(true); // Set loading state to true
      // const formData = new FormData();
      // formData.append("image", data.image[0]);
      try {
        await axios.put(`/api/user/${userId}`, {
          name,
          email,
          nomor_telepon,
          universitas: lulusan,
          alamat,
        });
        mutate(`/api/user/${userId}`);
        mutate(`/api/user`);
        mutate(`/api/user/getadmin`);
      } catch (error: any) {

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {

            const responseData = axiosError.response.data as { message: string };

            // Extract the main error message from the response data
            const errorMessage = responseData.message;

            setError(`${errorMessage}`);
          } else if (axiosError.request) {

            const request = axiosError.request.toString();
            setError(`No response received: ${request}`);
          } else {

            const request = axiosError.message.toString();
            setError(`${request}`);
          }
        } else {
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
          nomor_telepon,
          universitas: lulusan,
          alamat,
        });
        await axios.put(`/api/user/userimg/${userId}`, {});
        mutate("/api/user");
        mutate(`/api/userimg`);
        mutate(`/api/user/getadmin`);
      } catch (error: any) {

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {


            const responseData = axiosError.response.data as { message: string };

            // Extract the main error message from the response data
            const errorMessage = responseData.message;

            setError(` ${errorMessage}`);
          } else if (axiosError.request) {

            const request = axiosError.request.toString();
            setError(` ${request}`);
          } else {

            const request = axiosError.message.toString();
            setError(` ${request}`);
          }
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
        onClose();
        onSucsess();
      }
    }
  };

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
                data?.image ? "/api/user/img?img=" + data?.image : "/img/user/default.png"
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
