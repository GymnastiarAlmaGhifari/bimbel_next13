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

interface MapelEditProps {
    mapelId: string;
    data: any;
    onClose: () => void;
}

const schema = yup.object().shape({
    nama_mapel: yup.string().required("tidak boleh kosong").min(3, "nama mapel minimal 3 karakter"),
    // nama_kelas: yup.string().required("tidak boleh kosong").min(3, "nama kelas minimal 3 karakter"),
});

type FormData = yup.InferType<typeof schema>;

const MapelEdit: FC<MapelEditProps> = ({ mapelId, onClose, data }) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { nama_mapel } = data;

        setIsLoading(true); // Set loading state to true

        try {
            await axios.put(`/api/mapel/${mapelId}`, {
                nama_mapel,
            });

            mutate("/api/mapel");
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
                        <div className="form-group">
                            <Input
                                id="nama_mapel"
                                label="Nama Mapel"
                                register={{ ...register("nama_mapel") }}
                                errors={errors}
                                defaultValue={data.nama_mapel}
                            />
                            {
                                errors.nama_mapel && <p className="text-red-500">
                                    {errors.nama_mapel.message}
                                </p>
                            }
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Simpan
                            </button>
                        </div>
                    </>
                )}
            </>
        </form>
    );
};

export default MapelEdit;