import { FC, useEffect, useState } from "react";
import axios from "axios";
import Button from "@/pages/components/buttons/Button";
import { mutate } from "swr";

interface DeleteModulProps {
    idModul: string;
    onClose: () => void;
    onSuccess: () => void;
    data?: any;
}
const DeleteModul: FC<DeleteModulProps> = ({ idModul, onClose, onSuccess, data }) => {

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        setIsLoading(true); // Set loading state to true
        try {
            await axios.delete(`/api/modul/${idModul}`);
            mutate("/api/modul");

            onSuccess();
            onClose();
        } catch (error) {
        } finally {
            setIsLoading(true); // Set loading state to true
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <p className="text-center">
                Apakah Anda yakin untuk menghapus modul <span className="font-semibold">{data?.nama_modul}</span>? <br /> proses akan menghapus semua data yang berhubungan dengan modul ini
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

export default DeleteModul