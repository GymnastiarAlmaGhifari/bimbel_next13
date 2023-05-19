import { FC, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";

interface UserCreateProps {
    onClose: () => void;
    onSucsess: () => void;
}

const schema = yup.object().shape({
    nama: yup
        .string()
        .required("tidak boleh kosong")
        .min(3, "judul minimal 3 karakter"),
    email: yup.string().required(),
    password: yup.string().required(),
    nomor_telepon: yup
        .string()
        .required()
        .max(13, "maksimal 13 karakter")
        .min(12, "minimal 12 karakter"),
    alamat: yup.string().required(),
    sekolah: yup.string(),
    hp_ortu: yup
        .string()
        .max(13, "maksimal 13 karakter")
        .min(12, "minimal 12 karakter"),
});

type FormData = yup.InferType<typeof schema>;

const CreateSiswa: FC<UserCreateProps> = ({ onClose, onSucsess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { nama, email, password, hp_ortu, nomor_telepon, alamat, sekolah } = data;

        setIsLoading(true); // Set loading state to true
        setError(null);

        try {
            await axios.post(`/api/siswa`, {
                nama,
                email,
                hp_ortu,
                password,
                nomor_telepon,
                sekolah,
                alamat,
            });

            mutate("/api/siswa");
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
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Error message */}
            {error && <p className="text-red-500">{error}</p>}
            <Input
                id="nama"
                label="Name"
                type="text"
                register={{ ...register("nama") }}
                errors={errors}
            />
            {errors.nama && <p className="text-red-500">{errors.nama.message}</p>}

            <Input
                id="email"
                label="Email"
                type="email"
                register={{ ...register("email") }}
                errors={errors}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <Input
                id="password"
                label="Password"
                type="password"
                register={{ ...register("password") }}
                errors={errors}
            />
            {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
            )}

            <Input
                id="nomor_telepon"
                label="Nomor Telepon"
                type="number"
                register={{ ...register("nomor_telepon") }}
                errors={errors}
            />
            {errors.nomor_telepon && (
                <p className="text-red-500">{errors.nomor_telepon.message}</p>
            )}

            <Input
                id="sekolah"
                label="Sekolah"
                type="text"
                register={{ ...register("sekolah") }}
                errors={errors}
            />
            {errors.sekolah && (
                <p className="text-red-500">{errors.sekolah.message}</p>
            )}

            <Input
                id="hp_ortu"
                label="Nomor Telepon Orang Tua"
                type="number"
                register={{ ...register("hp_ortu") }}
                errors={errors}
            />
            {errors.hp_ortu && (
                <p className="text-red-500">{errors.hp_ortu.message}</p>
            )}


            <Input
                id="alamat"
                label="Alamat"
                type="text"
                register={{ ...register("alamat") }}
                errors={errors}
            />
            {errors.alamat && <p className="text-red-500">{errors.alamat.message}</p>}

            {/* Buat selected berisi SUPER ADMIN dan TENTOR */}
            <div className="flex flex-row justify-end">
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
                    bgColor="bg-Tertiary-50"
                    brColor=""
                    label="Konfirmasi"
                    textColor="text-Neutral-100"
                    withBgColor
                />
            </div>
        </form>
    );
};

export default CreateSiswa;
