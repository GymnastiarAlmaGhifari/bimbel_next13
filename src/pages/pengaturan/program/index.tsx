import Link from 'next/link'
import React, { FC } from 'react'
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@/libs/fetcher';
import { ModalDetail } from '@/pages/components/Modal';
import ProgramEdit from './edit';


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


const Program: FC<Props> = () => {

    const { data: program, error } = useSWR<Program[]>('/api/program', fetcher, {});

    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    useEffect(() => {
        if (error) {

        }
    }, [error]);

    const onClose = () => {
        setSelectedProgram(null);
    };

    if (error) {
        return <p>Error loading program.</p>;
    }

    return (
        <div>
            <h1 className="font-bold text-4xl my-10">List Program</h1>
            {
                program ? (
                    <>
                        {program.length === 0 ? (
                            <p>No program found.</p>
                        ) : (
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
                                                <button
                                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                                    onClick={() => setSelectedProgram(item)}
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
                )


            }
            <Link
                href="/pengaturan"
            >
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                >
                    kembali
                </button>
            </Link>

            {
                selectedProgram && (
                    <ModalDetail
                        onOpen={true}
                        onClose={onClose}
                    >
                        <ProgramEdit
                            data={selectedProgram}
                            onClose={onClose}
                            programId={selectedProgram.id}
                        />
                    </ModalDetail>
                )
            }


        </div>
    )
}
export default Program
