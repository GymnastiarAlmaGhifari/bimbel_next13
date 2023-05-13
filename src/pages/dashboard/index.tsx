import { useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ModalDetail } from '@/pages/components/Modal';
import BookEdit from './edit/[id]';
import { GetServerSideProps } from 'next';
import fetcher from '@/libs/fetcher';

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

const Dashboard: React.FC<Props> = ({
    // books,
}) => {
    const router = useRouter();


    const { data: books, error } = useSWR<Book[]>('/api/books', fetcher, {});



    useEffect(() => {
        if (error) {
            // Handle error if necessary
        }
    }, [error]);

    const backDashboard = () => {
        router.push('/dashboard');
    };

    if (error) {
        return <p>Error loading books.</p>;
    }


    // data sudah berubah tetapi halaman harus di reload untuk melihat perubahan


    return (
        <div className="flex flex-row">
            <Sidebar />

            <div className="ml-10 w-full">
                <Navbar />
                <h1 className="font-bold text-4xl my-10">List Buku</h1>
                {/* button signout */}
                <button
                    onClick={() => signOut()}
                    className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
                >
                    Sign Out
                </button>

                {books ? (
                    <>
                        {books.length === 0 ? (
                            <p>No books found.</p>
                        ) : (
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
                                    {books.map((book: Book) => (
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
                                                    as={`/dashboard/edit`}
                                                >
                                                    <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20">
                                                        edit
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                ) : (
                    <p>Loading...</p>
                )}
                {router.query.edit && (
                    <ModalDetail onOpen={true} onClose={backDashboard}>
                        <BookEdit
                            bookId={router.query.edit as string}
                            onClose={backDashboard}

                        />
                    </ModalDetail>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
