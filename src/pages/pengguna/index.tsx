import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import prisma from '@/libs/prismadb';
import { ModalDetail } from "@/pages/components/Modal";
import UserEdit from './edit/[id]';
import Link from "next/link";
import { useRouter } from 'next/router';

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

const User: React.FC<Props> = ({ users }) => {

    const router = useRouter();
    const [selected, setSelected] = useState<User | null>(null);


    const backPengguna = () => {
        router.push("/pengguna");
    };

    // onchange untuk open modal
    // const [nama, setNama] = useState("");

    // // Fungsi untuk menangkap input nama dari UserEdit
    // const getName = (data: string) => {
    //     setNama(data);
    // };

    // // onclose setnama null dan time out 1 detik
    // const onClose = () => {
    //     setNama("");
    // };

    // useEffect(() => {
    //     // set a timeout to clear the name state variable after 1 second
    //     const timeoutId = setTimeout(() => {
    //         onClose();
    //     }, 1000);

    //     return () => {
    //         clearTimeout(timeoutId);
    //     };
    // }, [nama]);

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
        <div>
            <Sidebar />
            <div className="ml-80">
                <h1 className="font-bold text-4xl my-10">List Buku</h1>
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
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.nomor_telepon}</td>
                                <td>{user.alamat}</td>
                                <td>{user.createdAt.toString()}</td>
                                <td>{user.updatedAt.toString()}</td>
                                <td>
                                    <Link
                                        href={`/pengguna/?edit=${user.id}`}
                                        as={`/pengguna/edit`}
                                        onClick={() => setSelected(user)}
                                    >
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Edit
                                        </button>
                                    </Link>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {
                router.query.edit && (
                    <ModalDetail
                        onOpen={true}
                        onClose={backPengguna}
                    >
                        <UserEdit
                            userId={router.query.edit as string}
                            onClose={backPengguna}
                            onSucsess={
                                () => {
                                    setShowSuccess(true);
                                }
                            }
                        // onChange={getName}
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




        </div>
    );

};

export const getServerSideProps: GetServerSideProps = async () => {

    const users = await prisma.user.findMany();
    // Convert Date objects to string
    const serializedUsers = users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toString(),
        updatedAt: user.updatedAt.toString(),
    }));
    return {
        props: {
            users: serializedUsers,
        },
    };
};

export default User;
