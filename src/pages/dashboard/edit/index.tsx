"use client"

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

interface BookEditProps {
    bookId: string;
    data: any;
    onClose: () => void;
}

const schema = yup.object().shape({
    title: yup.string().required("tidak boleh kosong").min(3, "judul minimal 3 karakter"),
    author: yup.string().required(),
    description: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;

const BookEdit: FC<BookEditProps> = ({ bookId, onClose, data }) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { title, author, description } = data;

        setIsLoading(true); // Set loading state to true

        try {
            await axios.put(`/api/books/${bookId}`, {
                title,
                author,
                description,
            });

            mutate("/api/books");


        } catch (error) {
            console.error(error);
        } finally {
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
                            id="title"
                            label="Title"
                            type="text"
                            register={{ ...register("title") }}
                            errors={errors}
                            defaultValue={data?.title}
                        />
                        {
                            errors.title && <p className="text-red-500">
                                {errors.title.message}
                            </p>
                        }

                        <Input
                            id="author"
                            label="Author"
                            type="text"
                            register={{ ...register("author") }}
                            errors={errors}
                            defaultValue={data?.author}
                        />

                        <Input
                            id="description"
                            label="Description"
                            type="text"
                            register={{ ...register("description") }}
                            errors={errors}
                            defaultValue={data?.description}
                        />

                        <button type="submit">Submit</button>
                    </>
                )}
            </>
        </form>
    );
};

export default BookEdit;
