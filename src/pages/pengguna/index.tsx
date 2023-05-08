import { GetServerSideProps } from 'next';
import React from 'react';
import Sidebar from '../components/Sidebar';
import prisma from '@/libs/prismadb';
import { ModalDetail } from "@/pages/components/Modal";
import UserEdit from './editUser';


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

    // buat select id
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

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
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20">
                                        edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedUser && (
                <ModalDetail onClose={() => setSelectedUser(null)}>
                    <UserEdit
                        onClose={() => setSelectedUser(null)}
                        userId={selectedUser.id} />
                </ModalDetail>
            )}
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
