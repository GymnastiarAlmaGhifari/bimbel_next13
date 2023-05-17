import { FC, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import {
    SubmitHandler,
    useForm
} from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";

interface RuangCreateProps {
    onClose: () => void;
    onSucsess: () => void;
}

const schema = yup.object().shape({
    nama_kelas: yup
        .string()
        .required("tidak boleh kosong")
        .min(1, "nama ruang minimal 3 karakter"),
});

type FormData = yup.InferType<typeof schema>;

const CreateKelas: FC<RuangCreateProps> = ({ onClose, onSucsess }) => {

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
        const { nama_kelas, } = data;
        setIsLoading(true); // Set loading state to true
        setError(null);

        try {
            await axios.post(`/api/kelas`, {
                nama_kelas,
            });

            mutate("/api/kelas");// Set loading state to false

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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" >
            {/* Error message */}
            {error && <p className="text-red-500">{error}</p>}
            <Input
                id="nama_kelas"
                label="Nama Ruang"
                type="text"
                register={{ ...register("nama_kelas") }}
                errors={errors}
            />
            {errors.nama_kelas && <p className="text-red-500">{errors.nama_kelas.message}</p>}

            {/* Buat selected berisi SUPER ADMIN dan TENTOR */}
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
        </form>
    );
};

export default CreateKelas;