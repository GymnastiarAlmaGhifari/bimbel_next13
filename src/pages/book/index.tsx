// "use client"
// import axios from "axios";
// import { signOut, useSession } from "next-auth/react";
// import { useState, useEffect, Fragment } from "react";
// import { useRouter } from 'next/router';
// import Link from "next/link";
// import { ModalDetail } from "@/pages/components/Modal";
// import BookDetail from "@/pages/book/detail/index";
// import useSWR from 'swr'
// import fetcher from "@/libs/fetcher";
// import BookEdit from "./edit/[id]";

// interface Book {
//     id: string;
//     title: string;
//     author: string;
//     description: string;
//     price: number;
//     createdAt: string;
//     updatedAt: string;
// }

// const Buku = () => {
//     const { data: session, status } = useSession();

//     const [selectedBook, setSelectedBook] = useState<Book | null>(null);

//     // buat selectedbook edit
//     // const [selectedBookEdit, setSelectedBookEdit] = useState<Book | null>(null);

//     const router = useRouter();

//     // ambil api dengan swr
//     // const { data: booksSWR, error } = useSWR(`/api/books`, fetcher);
//     // if (error) return <div>Error loading books.</div>;
//     // if (!booksSWR) return <div>Loading...</div>;

//     const handleOpenBookDetail = (book: Book) => {
//         setSelectedBook(book);
//     };

//     // const handleOpenBookEdit = (book: Book) => {
//     //     setSelectedBookEdit(book);
//     // };

//     if (status === "loading") {
//         return <div>Loading...</div>;
//     }

//     if (!session) {
//         return <div>Kamu belum login.</div>;
//     }

//     // backdashboard dan modal keluar
//     const handleBackDashboard = () => {
//         setSelectedBook(null);
//         router.push("/book");
//     };

//     const backDashboard = () => {
//         router.push("/book");
//     };

//     // // modal menutup dengan method onClose
//     // const onClose = () => {
//     //     setSelectedBookEdit(null);
//     // };

//     return (
//         <>
//             <Fragment>
//                 <div className="">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Title</th>
//                                 <th>Author</th>
//                                 <th>Description</th>
//                                 <th>Price</th>
//                                 <th>Created At</th>
//                                 <th>Updated At</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {booksSWR.map((book: Book) => (
//                                 <tr key={book.id}>
//                                     <td>{book.title}</td>
//                                     <td>{book.author}</td>
//                                     <td>{book.description}</td>
//                                     <td>{book.price}</td>
//                                     <td>{book.createdAt}</td>
//                                     <td>{book.updatedAt}</td>

//                                     <td>
//                                         <button
//                                             className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
//                                             onClick={() => handleOpenBookDetail(book)}
//                                         >
//                                             detail
//                                         </button>

//                                         <Link
//                                             href={`/book/?edit=${book.id}`}
//                                             as={`/book/edit/${book.id}`}
//                                         >
//                                             <button
//                                                 className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
//                                             >
//                                                 edit
//                                             </button>
//                                         </Link>


//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     <button
//                         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
//                         onClick={() => void signOut()}
//                     >
//                         logout
//                     </button>
//                     {selectedBook && (
//                         <ModalDetail onClose={handleBackDashboard}>
//                             <BookDetail
//                                 bookId={selectedBook.id}
//                             />
//                         </ModalDetail>
//                     )}

//                     {/* jika router /id */}
//                     {
//                         router.query.edit && (
//                             <ModalDetail onClose={backDashboard}>
//                                 <BookEdit
//                                     bookId={router.query.edit as string}
//                                     onClose={backDashboard}
//                                 />
//                             </ModalDetail>
//                         )
//                     }
//                 </div>
//             </Fragment>
//         </>
//     );
// };

// export default Buku;


// {/* {session?.user.role === "ADMIN" && (
//                     <div className="">admin</div>
//                 )
//                 }
//                 {session?.user.role === "TENTOR" && (
//                     <div className="">TENTOR</div>
//                 )
//                 }
//                 {session?.user.role === "SUPER" && (
//                     <div className="">SUPER</div>
//                 )
//                 } */}





//     // jika buku kosong
//     // if (books.length === 0) {
//     //     return <div>Belum ada buku.</div>;
//     // }

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

const ListBook: React.FC<Props> = ({ books }) => {
    const router = useRouter();
    const backDashboard = () => {
        router.push("/book");
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
                                        href={`/book/?edit=${book.id}`}
                                        as={`/book/edit/${book.id}`}
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

export default ListBook;