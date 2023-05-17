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
import useSWR from "swr";
import fetcher from "@/libs/fetcher";

interface RuangCreateProps {
    onClose: () => void;
    onSucsess: () => void;
}

const schema = yup.object().shape({
    nama_program: yup
        .string()
        .required("tidak boleh kosong")
        .min(3, "nama program minimal 3 karakter"),
    level: yup.string().test({
        name: "Pilih level",
        message: "Pilih level dahulu",
        test: (value) => value !== "" && value !== "Pilih level",
    }),
    tipe: yup.string().test({
        name: "Pilih tipe",
        message: "Pilih tipe dahulu",
        test: (value) => value !== "" && value !== "Pilih tipe",
    }),
    kelas_id: yup.string().test({
        name: "Pilih kelas",
        message: "Pilih kelas dahulu",
        test: (value) => value !== "" && value !== "Pilih kelas",
    }),
});

type FormData = yup.InferType<typeof schema>;



const CreateProgram: FC<RuangCreateProps> = ({ onClose, onSucsess }) => {


    const { data: kelas, error: errorprogram } = useSWR<any[]>("/api/kelas", fetcher);

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
        const { nama_program, level, tipe, kelas_id } = data;

        setIsLoading(true); // Set loading state to true
        setError(null);

        try {
            await axios.post(`/api/program`, {
                nama_program,
                tipe,
                level,
                kelas_id,
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
            onSucsess();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" >
            {/* Error message */}
            {error && <p className="text-red-500">{error}</p>}
            <Input
                id="nama_program"
                label="Nama Program"
                type="text"
                register={{ ...register("nama_program") }}
                errors={errors}
            />
            {errors.nama_program && <p className="text-red-500">{errors.nama_program.message}</p>}

            <div className="">
                <label
                    htmlFor="level"
                    className="block text-sm font-medium text-gray-700"
                >
                    Level
                </label>
                <select
                    id="level"
                    autoComplete="level"
                    {...register("level")}
                    defaultValue=""
                    className={`mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.level ? "border-red-500" : "border-gray-300"
                        }`}
                >
                    <option value="">Pilih Level</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="REGULER">reguler</option>
                </select>
                {errors.level && (
                    <p className="mt-1 text-sm text-red-500">{errors.level.message}</p>
                )}
            </div>

            <div className="">
                <label
                    htmlFor="program_id"
                    className="block text-sm font-medium text-gray-700"
                >
                    Tipe
                </label>
                <select
                    id="tipe"
                    autoComplete="tipe"
                    {...register("tipe")}
                    defaultValue=""
                    className={`mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.tipe ? "border-red-500" : "border-gray-300"
                        }`}
                >
                    <option value="">Pilih Tipe</option>
                    <option value="PRIVATE">Private</option>
                    <option value="SEMI_PRIVATE">Semi Private</option>
                    <option value="KELOMPOK">Kelompok</option>
                </select>
                {errors.tipe && (
                    <p className="mt-1 text-sm text-red-500">{errors.tipe.message}</p>
                )}
            </div>

            <div className="">
                <label
                    htmlFor="kelas_id"
                    className="block text-sm font-medium text-gray-700"
                >
                    Kelas
                </label>
                <select
                    id="kelas_id"
                    autoComplete="kelas_id"
                    {...register("kelas_id")}
                    defaultValue=""
                    className={`mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.kelas_id ? "border-red-500" : "border-gray-300"
                        }`}
                >
                    <option value="">Pilih Kelas</option>
                    {kelas?.map((kelas) => (
                        <option key={kelas.id} value={kelas.id}>
                            {kelas.nama_kelas}
                        </option>
                    ))}
                </select>
                {errors.kelas_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.kelas_id.message}</p>
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

export default CreateProgram;