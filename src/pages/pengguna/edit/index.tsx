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


interface UserEditProps {
    userId: string;
    data: any;
    onClose: () => void;
    onSucsess: () => void;
}

const schema = yup.object().shape({
    name: yup.string().required("tidak boleh kosong").min(3, "judul minimal 3 karakter"),
    email: yup.string().required(),
    role: yup.string().required(),
    nomor_telepon: yup.string().required(),
    alamat: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;



const UserEdit: FC<UserEditProps> = ({ userId, onClose, onSucsess, data }) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { name, email, role, nomor_telepon, alamat } = data;

        setIsLoading(true); // Set loading state to true

        try {
            await axios.put(`/api/user/${userId}`, {
                name,
                email,
                role,
                nomor_telepon,
                alamat,
            });

            mutate("/api/user");

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); // Set loading state to false
            onClose();
            onSucsess();
        }
    };



    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <>
                {isLoading && <div className="loader">Loading...</div>}

                {!isLoading && (
                    <>
                        <Input
                            id="name"
                            label="Nama"
                            type="text"
                            register={{ ...register("name") }}
                            errors={errors}
                            defaultValue={data?.name}
                        />
                        {
                            errors.name && <p className="text-red-500">
                                {errors.name.message}
                            </p>
                        }

                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            register={{ ...register("email") }}
                            errors={errors}
                            defaultValue={data?.email}
                        />

                        {/* buat selected berisi SUPER ADMIN dan TENTOR*/}
                        <div>
                            <label htmlFor="role">Role</label>
                            <select id="role" {...register("role")} defaultValue={data?.role}>
                                <option value="SUPER ADMIN">SUPER ADMIN</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="TENTOR">TENTOR</option>
                            </select>
                        </div>


                        <Input
                            id="nomor_telepon"
                            label="Nomor Telepon"
                            type="number"
                            register={{ ...register("nomor_telepon") }}
                            errors={errors}
                            defaultValue={data?.nomor_telepon}
                        />
                        <Input
                            id="alamat"
                            label="Alamat"
                            type="text"
                            register={{ ...register("alamat") }}
                            errors={errors}
                            defaultValue={data?.alamat}
                        />
                        <button type="submit">Submit</button>
                    </>
                )}
            </>
        </form>
    );
};


export default UserEdit;


