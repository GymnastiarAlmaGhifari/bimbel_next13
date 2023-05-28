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

interface CreateDiskon {
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

const CreateDiskon: FC<CreateDiskon> = ({ onClose, onSuccess }) => {

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

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { nama_diskon, image } =
            data;

        setError(null);

        const formData = new FormData();
        formData.append("image", data.image[0]);

        try {
            const response = await axios.post(`/api/diskon`, {
                nama_diskon
            });

            const diskonId = response.data.id;

            await axios.post(`/api/diskon/imgup`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    from: diskonId,
                },
            });

            mutate("/api/diskon");
            onClose(); // Set loading state to false
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
            onSuccess();
        }
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
                    <div className="w-full">
                        <h1>
                            Gambar Diskon Landing Page
                        </h1>
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
                    <h1 className="-pt-2">
                        Pilih Gambar Diskon Landing Page
                    </h1>
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
                <div className="flex flex-col gap-10 w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <Input
                            id="nama_diskon"
                            label="Nama Diskon"
                            type="text"
                            register={{ ...register("nama_diskon") }}
                            errors={errors}
                        />
                        {errors.nama_diskon && (
                            <p className="text-red-500">{errors.nama_diskon.message}</p>
                        )}

                    </div>
                    <div className="flex flex-row justify-end">
                        <Button
                            type="submit"
                            bgColor="bg-Tertiary-50"
                            brColor=""
                            label="Konfirmasi"
                            textColor="text-Neutral-100"
                            withBgColor
                        />
                    </div>
                </div>
            </div>
        </form>
    )
}

export default CreateDiskon