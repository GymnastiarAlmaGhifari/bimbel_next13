import Link from 'next/link'
import React from 'react'
import { GetServerSideProps } from 'next';
import prisma from '@/libs/prismadb';

interface Kelas {
    id: string;
    nama_kelas: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Props {
    kelas: Kelas[];
}


const Kelas: React.FC<Props> = ({ kelas }) => {

    return (
        <div>
            <h1 className="font-bold text-4xl my-10">List Kelas</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Kelas</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {kelas.map((kelas) => (
                        <tr key={kelas.id}>
                            <td>{kelas.id}</td>
                            <td>{kelas.nama_kelas}</td>
                            <td>{kelas.createdAt.toString()}</td>
                            <td>{kelas.updatedAt.toString()}</td>
                            <td>
                                <Link
                                    href={`/pengaturan/kelas/edit/${kelas.id}`}
                                >
                                    <button
                                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                    >
                                        edit
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link
                href="/pengaturan"
            >
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                >
                    kembali
                </button>
            </Link>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const kelas = await prisma.kelas.findMany();

    const serializedBooks = kelas.map((kelas) => ({
        ...kelas,
        createdAt: kelas.createdAt.toString(),
        updatedAt: kelas.updatedAt.toString(),
    }));
    return {
        props: { kelas: serializedBooks },
    };
};

export default Kelas
