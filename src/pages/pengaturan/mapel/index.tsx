import Link from 'next/link'
import React from 'react'
import { GetServerSideProps } from 'next';
import prisma from '@/libs/prismadb';

interface Mapel {
    kelas: any;
    id: string;
    nama_mapel: string;
    kelas_id: string;
    nama_kelas: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Props {
    mapel: Mapel[];
}


const Mapel: React.FC<Props> = ({ mapel }) => {

    return (
        <div>
            <h1 className="font-bold text-4xl my-10">List Mapel</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Mapel</th>
                        <th>Kelas ID</th>
                        <th>Nama Kelas</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mapel.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nama_mapel}</td>
                            <td>{item.kelas_id}</td>
                            <td>{item.kelas.nama_kelas}</td>
                            <td>{item.createdAt.toString()}</td>
                            <td>{item.updatedAt.toString()}</td>
                            <td>
                                <Link
                                    href={`/pengaturan/mapel/edit/${item.id}`}
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

    // buatjoin dari table mapel dan kelas
    const mapel = await prisma.mapel.findMany({
        select: {
            id: true,
            nama_mapel: true,
            kelas_id: true,
            kelas: {
                select: {
                    nama_kelas: true
                }
            },
            createdAt: true,
            updatedAt: true
        }
    });

    const serializedMapel = mapel.map((item) => ({
        ...item,
        createdAt: item.createdAt.toString(),
        updatedAt: item.updatedAt.toString()
    }));

    return {
        props: {
            mapel: serializedMapel
        }
    }
}

export default Mapel
