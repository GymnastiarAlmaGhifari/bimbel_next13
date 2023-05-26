import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/pages/components/buttons/Button";

interface Acc {
    idAcc: string;
    data: any;
    onClose: () => void;
    // onSuccess: () => void;
}

const Acc: FC<Acc> = ({ idAcc, data, onClose }) => {
    return (
        <div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-Neutral-900">Konfirmasi Pembayaran</h1>
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
                            // label={isLoading ? "Loading..." : "Simpan"}
                            label="konfirmasi"
                            textColor="text-Neutral-100"
                            withBgColor
                        // disabled={isLoading} // Disable the button when loading is true
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Acc