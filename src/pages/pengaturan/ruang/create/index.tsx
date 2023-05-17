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
    nama: yup
        .string()
        .required("tidak boleh kosong")
        .min(3, "nama ruang minimal 3 karakter"),
    tipe: yup.string().required("tidak boleh kosong"),
});

type FormData = yup.InferType<typeof schema>;



const Create: FC<RuangCreateProps> = ({ onClose, onSucsess }) => {

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
        const { nama, tipe } = data;

        setIsLoading(true); // Set loading state to true
        setError(null);

        try {
            await axios.post(`/api/ruang`, {
                nama,
                tipe,
            });

            mutate("/api/ruang");
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" >
            {/* Error message */}
            {error && <p className="text-red-500">{error}</p>}
            <Input
                id="nama"
                label="Nama Ruang"
                type="text"
                register={{ ...register("nama") }}
                errors={errors}
            />
            {errors.nama && <p className="text-red-500">{errors.nama.message}</p>}

            <div className="">
                <label className="form-label">Tipe Ruang</label>
                <select
                    className="form-select"
                    {...register("tipe")}
                    defaultValue={"KELAS"}
                >
                    <option value="KELAS">Kelas</option>
                    <option value="RUMAH">Rumah</option>
                </select>
                {errors.tipe && (
                    <p className="text-red-500">{errors.tipe.message}</p>
                )}
            </div>

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

export default Create;