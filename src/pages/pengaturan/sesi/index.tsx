import Link from 'next/link'
import React from 'react'
import { GetServerSideProps } from 'next';
import prisma from '@/libs/prismadb';

interface Sesi {
    id: string;
    nama_sesi: string;
    jam_mulai: string;
    jam_selesai: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Props {
    sesi: Sesi[];
}


const Sesi: React.FC<Props> = ({ sesi }) => {

    return (
        <div>
            <h1 className="font-bold text-4xl my-10">List Sesi</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Sesi</th>
                        <th>Mulai Sesi</th>
                        <th>Selesai Sesi</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sesi.map((sesi) => (
                        <tr key={sesi.id}>
                            <td>{sesi.id}</td>
                            <td>{sesi.nama_sesi}</td>
                            <td>{sesi.jam_mulai}</td>
                            <td>{sesi.jam_selesai}</td>
                            <td>{sesi.createdAt.toString()}</td>
                            <td>{sesi.updatedAt.toString()}</td>
                            <td>
                                <Link
                                    href={`/pengaturan/sesi/edit/${sesi.id}`}
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
    const sesi = await prisma.sesi.findMany();

    const serializedBooks = sesi.map((sesi) => ({
        ...sesi,
        jam_mulai: sesi.jam_mulai.toString(),
        jam_selesai: sesi.jam_selesai.toString(),
        createdAt: sesi.createdAt.toString(),
        updatedAt: sesi.updatedAt.toString(),
    }));
    return {
        props: { sesi: serializedBooks },
    };
};

export default Sesi
