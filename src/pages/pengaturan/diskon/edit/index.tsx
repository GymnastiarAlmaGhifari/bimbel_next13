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
import Image from "next/image";
import { IoMdCloudUpload } from "react-icons/io";

interface DiskonEditProps {
  diskonId: string;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

const schema = yup.object().shape({
  nama_diskon: yup
    .string()
    .required("tidak boleh kosong")
    .min(3, "nama diskon minimal 3 karakter"),
  image: yup.mixed().required(),
});

type FormData = yup.InferType<typeof schema> & {
  image: FileList;
};

const EditDiskon: FC<DiskonEditProps> = ({
  diskonId,
  data,
  onClose,
  onSuccess,
}) => {
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
    resolver: yupResolver(schema),
  });

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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { nama_diskon, image } = data;

    setIsLoading(true); // Set loading state to true

    const formData = new FormData();
    formData.append("image", data.image[0]);
    if (!image || image.length === 0) {
      try {
        await axios.put(`/api/diskon/${diskonId}`, {
          nama_diskon,
        });
        mutate("/api/diskon");
        mutate(`/api/diskon/${diskonId}`);
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
        onSuccess();
      }
    } else {
      try {
        await axios.put(`/api/diskon/${diskonId}`, {
          nama_diskon,
        });
        console.log("dengan gambar");

        await axios.post(`/api/diskon/imgup`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            from: diskonId,
          },
        });
        mutate("/api/diskon");
        mutate(`/api/diskon/${diskonId}`);
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
        onSuccess();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 items-center"
    >
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-6 w-full ">
        {previewImage ? (
          <div className="">
            <div className="overflow-clip h-[400px] w-full">
              <Image
                src={previewImage}
                alt="Gambar"
                width={200}
                height={200}
                className="w-full h-full object-cover"
                loader={({ src }) => `${src}?cache-control=no-store`}
              />
            </div>
          </div>
        ) : (
          <div className="overflow-clip h-[400px] w-full">
            <Image
              src={
                "/api/diskon/img?img=" + data?.banner || "/img/user/default.png"
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
            id="nama_diskon"
            label="Nama Diskon"
            defaultValue={data?.nama_diskon ?? ""}
            errors={errors}
            register={{ ...register("nama_diskon") }}
          />
          {errors.nama_diskon && (
            <span className="text-danger">{errors.nama_diskon.message}</span>
          )}
        </div>
      </div>

      <div className="flex w-full gap-4 justify-end">
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
    </form>
  );
};

export default EditDiskon;
