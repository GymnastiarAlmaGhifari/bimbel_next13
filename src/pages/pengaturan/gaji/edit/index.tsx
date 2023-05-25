import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import { IoMdCloudUpload, IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import { MdModeEdit } from "react-icons/md";

interface GajiEdit {
    gajiId?: string;
    data: any;
    onClose: () => void;
    onSucsess: () => void;
}

const schema = yup.object().shape({
    gaji: yup.number().required(),
    role: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const GajiEdit: FC<GajiEdit> = ({ gajiId, data, onClose, onSucsess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [isListOpen, setIsListOpen] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });
    const componentRef = useRef<HTMLUListElement>(null);
    useEffect(() => {
        // Menangani klik di luar komponen
        const handleOutsideClick = (event: any) => {
            if (
                componentRef.current &&
                !componentRef.current.contains(event.target)
            ) {
                setIsListOpen(false);
            }
        };

        // Menambahkan event listener ketika komponen di-mount
        document.addEventListener("mousedown", handleOutsideClick);

        // Membersihkan event listener ketika komponen di-unmount
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [setIsListOpen, componentRef]);
    const roleOptions = [
        { value: "SUPER", label: "SUPER ADMIN" },
        { value: "ADMIN", label: "ADMIN" },
        { value: "TENTOR", label: "TENTOR" },

    ];

    const toggleList = () => {
        setIsListOpen(!isListOpen);
    };

    const selectRole = (role: string) => {
        setValue("role", role);
        setIsListOpen(false);
    };

    const getRoleLabel = (value: string) => {
        const option = roleOptions.find((option) => option.value === value);
        return option ? option.label : "";
    };

    const roleLabel = data?.role === "SUPER" ? "SUPER ADMIN" : data?.role === "ADMIN" ? "ADMIN" : data?.role === "TENTOR" ? "TENTOR" : "Pilih peran";


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setIsLoading(true);
        const payload = {
            jumlah_gaji: data.gaji,
            role: data.role,
        };
        try {
            await axios.put(`/api/setgaji/${gajiId}`, payload);
            mutate("/api/setgaji");
            onSucsess();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            onClose();
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-10">
            <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-sm text-Primary-10">
                    Role
                </label>

                <div className="relative flex flex-col gap-2">
                    <button
                        type="button"
                        className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpen
                            ? "border-[2px] border-Primary-50 bg-Primary-95"
                            : "bg-Neutral-95"
                            }`}
                        onClick={toggleList}
                    >
                        {getRoleLabel(roleLabel)}
                        {isListOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                    {isListOpen && (
                        <ul className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1" ref={componentRef}>
                            {roleOptions.map((option) => (
                                <li key={option.value}>
                                    <button
                                        type="button"
                                        className={`w-full text-left px-2 py-1 rounded-full ${watch("role") === option.value
                                            ? "text-Primary-90 bg-Primary-20"
                                            : "text-Primary-20 hover:bg-Primary-95"
                                            }`}
                                        onClick={() => selectRole(option.value)}
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
            </div>
            <Input
                id="gaji"
                label="Gaji"
                type="number"
                defaultValue={data?.jumlah_gaji}
                errors={errors}
                register={{ ...register("gaji") }}

            />
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

export default GajiEdit;