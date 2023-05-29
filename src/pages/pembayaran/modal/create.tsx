import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import fetcher from "@/libs/fetcher";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/pages/components/buttons/Button";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";


interface Create {
    onClose: () => void;
    onSucsess: () => void;
}

interface CreateTagihan {
    id: string
    prgram_id: string
}


const schema = yup.object().shape({
    program_id: yup.string().test({
        name: "Pilih program",
        message: "Pilih program dahulu",
        test: (value) => value !== "" && value !== "Pilih program",
    }),
});


type FormData = yup.InferType<typeof schema>;


const Create: React.FC<Create> = ({
    onClose,
    onSucsess
}) => {


    const { data: program, error, isLoading } = useSWR("/api/program", fetcher, {})

    const {
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const [isListOpenProgram, setIsListOpenProgram] = useState(false);
    const componentRef = useRef<HTMLUListElement>(null);
    const [errorAxios, setErrorAxios] = useState<string | null>(null);

    useEffect(() => {
        // Menangani klik di luar komponen
        const handleOutsideClick = (event: any) => {
            if (
                componentRef.current &&
                !componentRef.current.contains(event.target)
            ) {
                setIsListOpenProgram(false);
            }
        };
        // Menambahkan event listener ketika komponen di-mount
        document.addEventListener("mousedown", handleOutsideClick);

        // Membersihkan event listener ketika komponen di-unmount
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [setIsListOpenProgram, componentRef]);

    const toggleListProgram = () => {
        setIsListOpenProgram(!isListOpenProgram);
    };

    const selectProgram = (program_id: string) => {
        setValue("program_id", program_id);
        setIsListOpenProgram(false);
    };

    useEffect(() => {
        setValue("program_id", "Pilih program");
    }, [setValue]);


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { program_id } = data;
        setErrorAxios(null);

        try {
            const response = await axios.post(`/api/tagihan/create/${program_id}`, {
                program_id,
            });

            console.log(response.data);

            mutate(`/api/tagihan/create/${program_id}`);
            mutate("/api/tagihan");
            onClose(); // Set loading state to false
            onSucsess();
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

                    setErrorAxios(`An error occurred: ${errorMessage}`);
                } else if (axiosError.request) {
                    console.log("No response received:", axiosError.request);

                    const request = axiosError.request.toString();
                    setErrorAxios(`No response received: ${request}`);
                } else {
                    console.log("Error setting up the request:", axiosError.message);

                    const request = axiosError.message.toString();
                    setErrorAxios(`Error setting up the request: ${request}`);
                }
            } else {
                console.log("Error:", error.message);
                setErrorAxios("An unknown error occurred.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Error message */}
            {errorAxios && <p className="text-red-500">{errorAxios}</p>}
            <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-sm text-Primary-10">
                    Program
                </label>

                <div className="relative flex flex-col gap-2">
                    <button
                        type="button"
                        className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenProgram
                            ? "border-[2px] border-Primary-50 bg-Primary-95"
                            : "bg-Neutral-95"
                            }`}
                        onClick={toggleListProgram}
                    >
                        {/* buat labe value dari id dan label berupa dari nama_perogram */}
                        {watch("program_id") === "Pilih program"
                            ? "Pilih program"
                            : program?.find((programItem: any) => programItem.id === watch("program_id"))?.nama_program}

                        {isListOpenProgram ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                    {isListOpenProgram && (
                        <ul
                            className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1"
                            ref={componentRef}
                        >
                            {error ? (
                                <li>Error fetching data</li>
                            ) : !program ? (
                                <li>Loading...</li>
                            ) : program.length === 0 ? (
                                <li>No classes available</li>
                            ) : (
                                program.map((programItem: any) => (
                                    <li key={programItem.id}>
                                        <button
                                            type="button"
                                            className={`w-full text-left px-2 py-1 rounded-full ${watch("program_id") === programItem.id
                                                ? "text-Primary-90 bg-Primary-20"
                                                : "text-Primary-20 hover:bg-Primary-95"
                                                }`}
                                            onClick={() => selectProgram(programItem.id)}
                                        >
                                            {programItem.nama_program}
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
                {errors.program_id && (
                    <span className="text-red-500">{errors.program_id.message}</span>
                )}
            </div>
            {/* button submit */}
            <div className="flex flex-row justify-end gap-4">
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
                    // label ketika loading true maka labelnya jadi loading
                    label={
                        isLoading ? (
                            <div className="flex gap-1 items-center">
                                <div className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]"></div>
                                <span>Loading</span>
                            </div>
                        ) : (
                            "Konfirmasi"
                        )
                    }
                    textColor="text-Neutral-100"
                    withBgColor
                />
            </div>
        </form>
    )
}

export default Create