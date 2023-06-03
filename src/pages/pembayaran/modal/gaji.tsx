import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import fetcher from "@/libs/fetcher";
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";

interface RekeningProps {
    onClose: () => void;
    onSucsess: () => void;
    data?: any;
}

const schema = yup.object().shape({
    nama_rekening: yup.string().required(),
    nomor_rekening: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;

const EditRekening: FC<RekeningProps> = ({
    onClose,
    onSucsess,
    data
}) => {

    let idrek = data[0]?.id

    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setIsLoading(true);

        const { nama_rekening, nomor_rekening } = data;

        try {
            await axios.put(`/api/rekening/${idrek}`, {
                nama_rekening,
                nomor_rekening,
            });
            mutate(`/api/rekening`);

            onSucsess();
        } catch (error) {
        } finally {
            setIsLoading(false);
            onClose();
            onSucsess();
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
            <Input
                id="nama_rekening"
                label="Nama Rekening"
                errors={errors}
                // defautl value diambil dari data yang dikirim dari parent data.?nama_rekening
                defaultValue={data[0]?.nama_rekening}
                type="text"
                register={{ ...register("nama_rekening") }}
            />
            {errors.nama_rekening && (
                <p className="text-red-500">{errors.nama_rekening.message}</p>
            )}
            <Input
                id="nomor_rekening"
                label="Nomor Rekening"
                // defautl value diambil dari data yang dikirim dari parent data.?nomor_rekening
                defaultValue={data[0]?.nomor_rekening}
                errors={errors}
                type="number"
                register={{ ...register("nomor_rekening") }}
            />
            {errors.nomor_rekening && (
                <p className="text-red-500">{errors.nomor_rekening.message}</p>
            )}
            <div className="flex justify-end gap-4">
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
                    label={
                        isLoading ? (
                            <div className="flex gap-2 items-center">
                                <div className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]"></div>
                                <span>Loading</span>
                            </div>
                        ) : (
                            "Simpan"
                        )
                    }
                    textColor="text-Neutral-100"
                    withBgColor
                    disabled={isLoading} // Disable the button when loading is true
                />
            </div>
        </form>
    )
}

export default EditRekening