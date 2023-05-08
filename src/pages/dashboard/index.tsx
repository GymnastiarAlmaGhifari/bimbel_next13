import { GetServerSideProps } from 'next';
import React from 'react';
import Sidebar from '../components/Sidebar';
import { ModalDetail } from "@/pages/components/Modal";
import BookEdit from "./edit/[id]";
import prisma from '@/libs/prismadb';
import Link from "next/link";
import { useRouter } from 'next/router';


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
    const router = useRouter();
    const backDashboard = () => {
        router.push("/dashboard");
    };
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
                                    <Link
                                        href={`/dashboard/?edit=${book.id}`}
                                        as={`/dashboard/edit/${book.id}`}
                                    >
                                        <button
                                            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
                                        >
                                            edit
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    router.query.edit && (<ModalDetail onClose={backDashboard}>
                        <BookEdit
                            bookId={router.query.edit as string}
                            onClose={backDashboard}
                        />
                    </ModalDetail>
                    )
                }
            </div>

        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
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
};

export default Dashboard;