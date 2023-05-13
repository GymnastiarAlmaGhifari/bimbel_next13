import useSWR from 'swr';
import fetcher from '@/libs/fetcher';
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { ModalDetail } from "@/pages/components/Modal";
import UserEdit from './edit';
import Navbar from '../components/Navbar';
import Create from './create';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    nomor_telepon: string;
    alamat: string;
    createdAt: Date;
    updatedAt: Date;
    img: string;
}

interface Props {
    users: User[];
}

const User: React.FC<Props> = () => {
    const { data: users, error } = useSWR<User[]>('/api/user', fetcher);
    const [selected, setSelected] = useState<User | null>(null);

    useEffect(() => {
        if (error) {

        }
    }, [error]);


    const backPengguna = () => {
        setSelected(null);
    };

    // open modal create
    const [showCreate, setShowCreate] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        // set a timeout to clear the name state variable after 1 second
        const timeoutId = setTimeout(() => {
            setShowSuccess(false);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [showSuccess]);

    return (
        <div className="flex flex-row">
            <Sidebar />

            <div className="ml-10 w-full">
                <Navbar />
                <h1 className="font-bold text-4xl my-10">List user</h1>

                {/* button create */}
                <button
                    onClick={
                        () => {
                            setShowCreate(true);
                        }
                    }
                    className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
                >
                    Create
                </button>


                {users ? (
                    <>
                        {users.length === 0 ? (
                            <p>No books found.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Nomor Telepon</th>
                                        <th>Alamat</th>
                                        <th>Created At</th>
                                        <th>Updated At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user: User) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>{user.nomor_telepon}</td>
                                            <td>{user.alamat}</td>
                                            <td>{user.createdAt.toString()}</td>
                                            <td>{user.updatedAt.toString()}</td>
                                            <td>
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => setSelected(user)}
                                                >
                                                    Edit
                                                </button>


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
            </div>
            {
                selected && (
                    <ModalDetail
                        onOpen={true}
                        onClose={backPengguna}
                    >
                        <UserEdit
                            userId={selected.id}
                            onClose={backPengguna}
                            onSucsess={
                                () => {
                                    setShowSuccess(true);
                                }
                            }
                            data={selected}
                        />
                    </ModalDetail>
                )
            }

            {/* buat modal dari getname  */}
            {showSuccess && (
                <ModalDetail
                    onOpen={true}
                    onClose={() => setShowSuccess(false)}

                >
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-green-500">Berhasil</h1>
                        <p className="text-sm text-gray-500">{selected?.name}Data berhasil diubah</p>
                    </div>
                </ModalDetail>
            )
            }

            {/* modal create */}
            {showCreate && (
                <ModalDetail
                    onOpen={true}
                    onClose={() => setShowCreate(false)}
                >
                    <Create />
                </ModalDetail>
            )
            }

        </div>
    );

};

export default User;
