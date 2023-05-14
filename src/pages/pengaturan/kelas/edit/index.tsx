import { FC, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import {
    SubmitHandler,
    useForm
} from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";


interface KelasEditProps {
    kelasId: string;
    data: any;
    onClose: () => void;
}

const schema = yup.object().shape({
    nama_kelas: yup.string().required("tidak boleh kosong").min(3, "nama kelas minimal 3 karakter"),
});

type FormData = yup.InferType<typeof schema>;

const KelasEdit: FC<KelasEditProps> = ({ kelasId, onClose, data }) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { nama_kelas } = data;

        setIsLoading(true); // Set loading state to true

        try {
            await axios.put(`/api/kelas/${kelasId}`, {
                nama_kelas,
            });

            mutate("/api/kelas");
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
            onClose(); // Set loading state to false
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <>
                {isLoading && <div className="loader">Loading...</div>}

                {!isLoading && (
                    <>
                        <Input
                            id="nama_kelas"
                            label="Nama Kelas"
                            errors={errors}
                            register={{ ...register("nama_kelas") }}
                            defaultValue={data.nama_kelas}
                        />
                        {
                            errors.nama_kelas && <p className="text-red-500">{errors.nama_kelas.message}</p>
                        }
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Simpan
                        </button>
                    </>
                )}
            </>
        </form >
    );
};

export default KelasEdit;