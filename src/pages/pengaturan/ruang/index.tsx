import Link from 'next/link'
import React from 'react'
import { GetServerSideProps } from 'next';
import prisma from '@/libs/prismadb';

interface Ruang {
    id: string;
    nama: string;
    tipe: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Props {
    ruang: Ruang[];
}


const Ruang: React.FC<Props> = ({ ruang }) => {

    return (
        <div>
            <h1 className="font-bold text-4xl my-10">List Ruang</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Ruang</th>
                        <th>Tipe Ruang</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ruang.map((ruang) => (
                        <tr key={ruang.id}>
                            <td>{ruang.id}</td>
                            <td>{ruang.nama}</td>
                            <td>{ruang.tipe}</td>
                            <td>{ruang.createdAt.toString()}</td>
                            <td>{ruang.updatedAt.toString()}</td>
                            <td>
                                <Link
                                    href={`/pengaturan/ruang/edit/${ruang.id}`}
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
    const ruang = await prisma.ruang.findMany();

    const serializedBooks = ruang.map((ruang) => ({
        ...ruang,
        createdAt: ruang.createdAt.toString(),
        updatedAt: ruang.updatedAt.toString(),
    }));
    return {
        props: { ruang: serializedBooks },
    };
};

export default Ruang
