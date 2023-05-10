import Link from 'next/link'
import React from 'react'
import { GetServerSideProps } from 'next';
import prisma from '@/libs/prismadb';

interface Program {
    kelas: any;
    id: string;
    nama_program: string;
    level: string;
    tipe: string;
    nama_kelas: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Props {
    program: Program[];
}


const Program: React.FC<Props> = ({ program }) => {

    return (
        <div>
            <h1 className="font-bold text-4xl my-10">List Program</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Program</th>
                        <th>Level</th>
                        <th>Tipe</th>
                        <th>Kelas</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {program.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nama_program}</td>
                            <td>{item.level}</td>
                            <td>{item.tipe}</td>
                            <td>{item.kelas.nama_kelas}</td>
                            <td>{item.createdAt.toString()}</td>
                            <td>{item.updatedAt.toString()}</td>
                            <td>
                                <Link
                                    href={`/pengaturan/program/edit/${item.id}`}
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

    // buatjoin dari table program dan kelas
    const program = await prisma.program.findMany({
        select: {
            id: true,
            nama_program: true,
            tipe: true,
            level: true,
            kelas: {
                select: {
                    nama_kelas: true
                }
            },
            createdAt: true,
            updatedAt: true
        }
    });

    const serializedMapel = program.map((item) => ({
        ...item,
        createdAt: item.createdAt.toString(),
        updatedAt: item.updatedAt.toString()
    }));

    return {
        props: {
            program: serializedMapel
        }
    }
}

export default Program
