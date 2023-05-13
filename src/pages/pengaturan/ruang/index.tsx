import Link from 'next/link'
import React, { FC } from 'react'
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@/libs/fetcher';
import { GetServerSideProps } from 'next';

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


const Ruang: FC<Props> = () => {

    const { data: ruang, error } = useSWR<Ruang[]>('/api/ruang', fetcher, {});

    const [selectedRuang, setSelectedRuang] = useState<Ruang | null>(null);

    useEffect(() => {
        if (error) {

        }

    }, [error]);

    const onClose = () => {
        setSelectedRuang(null);
    };

    if (error) {
        return <p>Error loading ruang.</p>;
    }


    return (
        <div>
            <h1 className="font-bold text-4xl my-10">List Ruang</h1>
            {
                ruang ? (
                    <>
                        {ruang.length === 0 ? (
                            <p>No ruang found.</p>
                        ) : (

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
        </div>
    )
}

export default Ruang
