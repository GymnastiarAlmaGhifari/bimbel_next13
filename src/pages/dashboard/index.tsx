import { GetServerSideProps } from 'next';
import React from 'react';
import Sidebar from '../components/Sidebar';
import prisma from '@/libs/prismadb';
import { ModalDetail } from "@/pages/components/Modal";
import BookEdit from "./editBook";


interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

interface Props {
    books: Book[];
}

const Dashboard: React.FC<Props> = ({ books }) => {

    // buat select id
    const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);

    return (
        <div>
            <Sidebar />
            <div className="ml-80">
                <h1 className="font-bold text-4xl my-10">List Buku</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.description}</td>
                                <td>{book.price}</td>
                                <td>{book.createdAt.toString()}</td>
                                <td>{book.updatedAt.toString()}</td>
                                <td>
                                    <button
                                        onClick={() => setSelectedBook(book)}
                                        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20">
                                        edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedBook && (
                <ModalDetail onClose={() => setSelectedBook(null)}>
                    <BookEdit
                        onClose={() => setSelectedBook(null)}
                        bookId={selectedBook.id} />
                </ModalDetail>
            )}
        </div>
    );

};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const books = await prisma.books.findMany();
        // Convert Date objects to string
        const serializedBooks = books.map((book) => ({
            ...book,
            createdAt: book.createdAt.toString(),
            updatedAt: book.updatedAt.toString(),
        }));
        return {
            props: {
                books: serializedBooks,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                books: [],
            },
        };
    }
};

export default Dashboard;
