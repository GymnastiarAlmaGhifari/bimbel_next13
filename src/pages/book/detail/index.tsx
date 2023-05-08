"use client"

import fetcher from "@/libs/fetcher";
import useSWR from 'swr'
import { FC } from "react";

interface BookIdProps {
    bookId: string;
}

const BookDetail: FC<BookIdProps> = ({ bookId }) => {
    const { data: book, error } = useSWR(`/api/books/${bookId}`, fetcher);
    if (error) return <div>Error loading book.</div>;
    if (!book) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-4">
            {/* display buku */}
            <div className="flex flex-col gap-2">
                <div className="text-2xl font-bold">{book?.title}</div>
                <div className="text-lg">{book?.author}</div>
                <div className="text-lg">{book?.description}</div>
            </div>
        </div>
    );
};

export default BookDetail;