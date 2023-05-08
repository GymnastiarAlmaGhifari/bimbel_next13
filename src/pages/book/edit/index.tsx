"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr"
import fetcher from "@/libs/fetcher";



interface BookEditProps {
    bookId: string;
    onClose: () => void;
}

const BookEdit = ({ bookId, onClose }: BookEditProps) => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");

    // mengambil data buku dari API menggunakan SWR
    const { data: book, error } = useSWR(`/api/books/${bookId}`, fetcher);

    if (error) return <div>Error loading book.</div>;
    if (!book) return <div>Loading...</div>;


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // mengirim data buku yang telah diubah ke API menggunakan method PUT
            await fetch(`/api/books/${bookId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title || book.title,
                    author: author || book.author,
                    description: description || book.description,
                }),
            });

            // memperbarui data buku di halaman dengan SWR
            mutate(`/api/books/${bookId}`);

            onClose()
            router.refresh();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title || book.title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="author">Author:</label>
                <input
                    type="text"
                    id="author"
                    value={author || book.author}
                    onChange={(event) => setAuthor(event.target.value)}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description || book.description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                />
            </div>
            <div className="flex gap-2">
                <button type="submit">Update</button>
                <button type="button"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default BookEdit;
