"use client"
import fetcher from "@/libs/fetcher";

import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR, { mutate } from "swr";
import {
    FieldValues,
    SubmitHandler,
    useForm
} from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

interface BookEditProps {
    bookId: string;
    onClose: () => void;
}

const schema = yup.object().shape({
    title: yup.string().required().min(3, "judul minimal 3 karakter"),
    author: yup.string().required(),
    description: yup.string().required(),
});
type FormData = yup.InferType<typeof schema>;



const BookEdit: React.FC<BookEditProps> = ({ bookId, onClose }) => {
    const router = useRouter();

    const { data: book, error } = useSWR(`/api/books/${bookId}`, fetcher);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            title: book?.title,
            author: book?.author,
            description: book?.description,
        },
        resolver: yupResolver(schema),
    });

    // tanpa yup
    // const {
    //     register,
    //     handleSubmit,
    //     formState: {
    //         errors,
    //     },
    // } = useForm<FieldValues>({
    //     defaultValues: {
    //         defaultValues: {
    //             title: book?.title,
    //             author: book?.author,
    //             description: book?.description,
    //         },
    //     },
    // });


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { title, author, description } = data;

        try {
            await axios.put(`/api/books/${bookId}`, {
                title,
                author,
                description,
            });

            mutate(`/api/books/${bookId}`);
            onClose();
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input
                id="title"
                label="Title"
                type="text"
                register={{ ...register("title") }}
                errors={errors}
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
            />

            <Input
                id="description"
                label="Description"
                type="text"
                register={{ ...register("description") }}
                errors={errors}
            />

            <button type="submit">Submit</button>
        </form>
    );
};

export default BookEdit;
