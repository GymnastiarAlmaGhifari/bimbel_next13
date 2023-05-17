import { FC, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import Image from "next/image";

interface UserEditProps {
    userId: string;
    data: any;
    onClose: () => void;
    onSucsess: () => void;
}

const schema = yup.object().shape({
    image: yup.mixed().required(),
});



type FormData = yup.InferType<typeof schema> & {
    image: FileList;
};

const UserEditGambar: FC<UserEditProps> = ({ userId, onClose, onSucsess, data }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
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
        const { image } = data;

        // jika tidak ada gambar dan tidak ada perubahan
        if (!image || image.length === 0) {

            setError("tidak ada gambar yang dipilih");

            return;
        }

        // if iamge size > 1mb
        if (image[0].size > 2000000) {
            setError("ukuran gambar terlalu besar maximal 2 mb");
            return;
        }

        setIsLoading(true); // Set loading state to true
        const formData = new FormData();
        formData.append("image", data.image[0]);
        try {
            await axios.post("/api/userimg", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    // from : formData . image
                    from: userId,
                },
            });
            await axios.put(`/api/userimg/${userId}`, {
                Nama: "balalalala"
            });
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

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <>
                {isLoading && <div className="loader">Loading...</div>}
                {!isLoading && (
                    <>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex flex-col gap-4 w-full">

                            <div>
                                <label
                                    htmlFor="image">
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
                                    onChange={handleImageChange}
                                />
                                {/* <Image  src={data?.image} alt="Gambar" width={200} height={200} /> */}
                                {errors?.image && (
                                    <p className="text-red-500">{errors.image?.message}</p>
                                )}
                            </div>
                            {previewImage ? (
                                <div>
                                    <label>Gambar:</label>
                                    <Image
                                        src={previewImage}
                                        alt="Gambar"
                                        width={200}
                                        height={200}
                                        loader={({ src }) => `${src}?cache-control=no-store`}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label>Gambar:</label>
                                    <Image
                                        src={data?.image || "/img/user/default.png"}
                                        alt="Gambar"
                                        width={200}
                                        height={200}
                                        loader={({ src }) => `${src}?cache-control=no-store`}
                                    />
                                </div>
                            )}

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
                    </>
                )}
            </>
        </form>
    );
};


export default UserEditGambar;

