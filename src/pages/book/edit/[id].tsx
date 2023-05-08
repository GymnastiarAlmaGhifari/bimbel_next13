"use client"

import { useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr"
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/Modal";



interface BookEditProps {
    bookId: string;
    onClose: () => void;
}

const BookEdit = ({ bookId, onClose }: BookEditProps) => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

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
            router.push("/book");

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {showSuccess && (
                <ModalDetail
                    onClose={() => setShowSuccess(false)}
                >
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-2xl font-semibold">Success</h1>
                        <p className="text-gray-500">Book has been updated.</p>
                        {/* ambil nama buku dari data yang diambil dari API */}
                        <p className="text-gray-500">{book.title}</p>
                    </div>
                </ModalDetail>
            )}

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        placeholder={book.title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="author">Author:</label>
                    <input
                        id="author"
                        type="text"
                        placeholder={book.author}
                        onChange={(event) => setAuthor(event.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        placeholder={book.description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Save
                    </button>
                </div>
            </form>
        </>
    );
};

export default BookEdit;
