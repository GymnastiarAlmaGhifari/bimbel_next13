import { FC, useEffect, useState } from "react";
import axios from "axios";
import Button from "@/pages/components/buttons/Button";
import { mutate } from "swr";

interface DeleteSiswaProps {
    idSiswa: string;
    onClose: () => void;
    onSuccess: () => void;
    data?: any;
    kelompokId?: string;
}
const DeleteSiswa: FC<DeleteSiswaProps> = ({ idSiswa, onClose, onSuccess, data, kelompokId }) => {

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        setIsLoading(true); // Set loading state to true
        try {
            await axios.delete(`/api/kelompok/rmsiswa/${idSiswa}`);
            mutate(`/api/kelompok/rmsiswa/${idSiswa}`);
            mutate(`/api/kelompok/siswa/${kelompokId}`);

            onSuccess();
            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(true); // Set loading state to true
        }
        console.log("idSiswa", idSiswa, "kelompokId", kelompokId);
    };


    return (
        <div className="flex flex-col gap-6">
            <p className="text-center">
                Apakah Anda yakin untuk mengeluarkan siswa <span className="font-semibold">{data?.name}</span>dari kelompok ini? 
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

export default DeleteSiswa