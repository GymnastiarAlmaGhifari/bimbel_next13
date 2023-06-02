import { FC, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/pages/components/buttons/Button";

interface Acc {
    idAcc: string;
    data: any;
    onClose: () => void;
    onSuccess: () => void;
}

const Acc: FC<Acc> = ({ idAcc, data, onClose,
    onSuccess
}) => {

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = async () => {
        setIsLoading(true); // Set loading state to true

        try {
            const response = await axios.put(`/api/tagihan/${idAcc}`, {
                status: "LUNAS",
            });

            console.log(response.data);

            mutate(`/api/tagihan`);
            mutate(`/api/notif`);
            onClose();
            onSuccess();
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
            onClose(); // Set loading state to false
        }

    };


    return (
        <div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    {error && <p className="text-red-500">{error}</p>}
                    <p className="text-Neutral-500">Apakah anda yakin ingin mengkonfirmasi pembayaran ini?</p>
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
                            center
                            type="submit"
                            bgColor="bg-Tertiary-50"
                            brColor=""
                            // label ketika loading true maka labelnya jadi loading
                            label={isLoading ? "Loading..." : "Simpan"}
                            // label="konfirmasi"
                            textColor="text-Neutral-100"
                            withBgColor
                            onClick={onSubmit}
                            disabled={isLoading} // Disable the button when loading is true
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Acc