"use client"
import fetcher from "@/libs/fetcher";

import { useEffect, useState } from "react";
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
    const { data: bookData, error, isLoading } = useSWR(`/api/books/${bookId}`, fetcher);

    // jika id tidak ditemukan maka akan di redirect ke halaman dashboard
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { title, author, description } = data;

        try {
            // Perform the update request here using the bookId and the updated data
            await axios.put(`/api/books/${bookId}`, {
                title,
                author,
                description,
            });

            // Update the local data without a revalidation
            mutate("/api/books");

            // Redirect to the dashboard page after successful update
            router.push("/dashboard");
        } catch (error) {
            // Handle any errors that occurred during the update
            console.error("Failed to update book:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Input
                        id="title"
                        label="Title"
                        type="text"
                        register={{ ...register("title") }}
                        errors={errors}
                        defaultvalue={bookData?.title}
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
                        defaultvalue={bookData?.author}
                    />

                    <Input
                        id="description"
                        label="Description"
                        type="text"
                        register={{ ...register("description") }}
                        errors={errors}
                        defaultvalue={bookData?.description}
                    />

                    <button type="submit">Submit</button>
                </>
            )}
        </form>
    );
};

export default BookEdit;
