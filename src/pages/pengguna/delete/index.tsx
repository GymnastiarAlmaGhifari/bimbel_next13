import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "@/pages/components/buttons/Button";
import { mutate } from "swr";

interface DeletePenggunaProps {
    idPengguna: string;
    onClose: () => void;
    onSuccess: () => void;
    data?: any;
}
const DeletePengguna: FC<DeletePenggunaProps> = ({ idPengguna, onClose, onSuccess, data }) => {

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        setIsLoading(true); // Set loading state to true
        try {
            await axios.delete(`/api/user/${idPengguna}`);
            mutate("/api/user");

            onSuccess();
            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(true); // Set loading state to true
        }
    };


    return (
        <div className="flex flex-col gap-6">
            <p className="text-center">
                Apakah Anda yakin untuk menghapus pengguna <span className="font-semibold">{data?.name}</span>? <br /> proses akan menghapus semua data yang berhubungan dengan pengguna ini
            </p>
            <div className="flex gap-4">
                <Button
                    center
                    bgColor="bg-Neutral-70"
                    brColor=""
                    label="Batal"
                    textColor="text-Neutral-30"
                    type="button"
                    onClick={onClose}
                    widthAuto
                />
                <button onClick={onSubmit} disabled={isLoading} className="w-full">
                    {isLoading ? (
                        "Deleting..."
                    ) : (
                        <Button
                            bgColor="bg-Error-50"
                            center
                            withBgColor
                            brColor=""
                            label="Delete"
                            textColor="text-Neutral-100"
                            type="button"
                            widthAuto
                        />
                    )}
                </button>
            </div>
        </div>
    )
}

export default DeletePengguna