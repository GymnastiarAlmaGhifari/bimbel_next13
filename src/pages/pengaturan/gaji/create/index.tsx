import { FC, useEffect, useRef, useState } from "react";
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
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface CreateGaji {
    onClose: () => void;
    onSucsess: () => void;
}

const schema = yup.object().shape({
    role: yup.string().required(),
    gaji: yup.number().required(),
});

type FormData = yup.InferType<typeof schema>;



const CreateGaji: FC<CreateGaji> = ({ onClose, onSucsess }) => {

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isListOpenRole, setIsListOpenRole] = useState(false);
    const componentRef = useRef<HTMLUListElement>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const selectrole = (role: string) => {
        setValue("role", role);
        setIsListOpenRole(false);
    };
    const roleOptions = [
        { value: "SUPER", label: "Super Admin" },
        { value: "ADMIN", label: "Admin" },
        { value: "TENTOR", label: "Tentor" },
    ];

    useEffect(() => {
        // Menangani klik di luar komponen
        const handleOutsideClick = (event: any) => {
            if (
                componentRef.current &&
                !componentRef.current.contains(event.target)
            ) {
                setIsListOpenRole(false);
            }
        };

        // Menambahkan event listener ketika komponen di-mount
        document.addEventListener("mousedown", handleOutsideClick);

        // Membersihkan event listener ketika komponen di-unmount
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [setIsListOpenRole, componentRef]);

    const toggleListRole = () => {
        setIsListOpenRole(!isListOpenRole);
    };

    const getRoleLabel = (value: string) => {
        const option = roleOptions.find((option) => option.value === value);
        return option ? option.label : "";
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { role, gaji } = data;

        setIsLoading(true);
        setError(null);

        try {
            await axios.post("/api/setgaji", {
                role,
                jumlah_gaji: gaji,
            });

            mutate("/api/setgaji");
            onClose();
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {error && <p className="text-red-500">{error}</p>}
            <div className="relative flex flex-col gap-2">
                <button
                    type="button"
                    className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenRole
                        ? "border-[2px] border-Primary-50 bg-Primary-95"
                        : "bg-Neutral-95"
                        }`}
                    onClick={toggleListRole}
                >
                    {getRoleLabel(watch("role")) || "Pilih Role"}
                    {isListOpenRole ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {isListOpenRole && (
                    <ul
                        className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                        ref={componentRef}
                    >
                        {roleOptions.map((option) => (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    className={`w-full text-left px-2 py-1 rounded-full ${watch("role") === option.value
                                        ? "text-Primary-90 bg-Primary-20"
                                        : "text-Primary-20 hover:bg-Primary-95"
                                        }`}
                                    onClick={() => selectrole(option.value)}
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
            <Input
                id="gaji"
                label="Gaji"
                type="number"
                register={{ ...register("gaji") }}
                errors={errors}
            />
            {
                errors.gaji && (
                    <span className="text-red-500">{errors.gaji.message}</span>
                )
            }
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
    )
}

export default CreateGaji