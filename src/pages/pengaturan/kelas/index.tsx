import Link from 'next/link'
import React, { FC } from 'react'
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@/libs/fetcher';
import { ModalDetail } from '@/pages/components/Modal';
import KelasEdit from './edit';


interface Kelas {
    id: string;
    nama_kelas: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Props {
    kelas: Kelas[];
}


const Kelas: FC<Props> = () => {

    const { data: kelas, error } = useSWR<Kelas[]>('/api/kelas', fetcher, {});

    const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);

    const onClose = () => {
        setSelectedKelas(null);
    };

    return (
        <div>
            <h1 className="font-bold text-4xl my-10">List Kelas</h1>
            {
                kelas ? (
                    <>
                        {kelas.length === 0 ? (
                            <p>No kelas found.</p>
                        ) : (
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
                                                <button
                                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                                    onClick={() => setSelectedKelas(kelas)}
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

            {selectedKelas && (
                <ModalDetail titleModal='Edit Kelas'
                    onOpen={true}
                    onClose={onClose}
                >
                    <KelasEdit
                        kelasId={selectedKelas.id}
                        data={selectedKelas}
                        onClose={onClose}
                    />

                </ModalDetail>
            )
            }
        </div>
    )
}

export default Kelas
