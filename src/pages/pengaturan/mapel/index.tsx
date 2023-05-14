import Link from 'next/link'
import React, { FC } from 'react'
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@/libs/fetcher';
import { ModalDetail } from '@/pages/components/Modal';
import MapelEdit from './edit';

interface Mapel {
    kelas: any;
    id: string;
    nama_mapel: string;
    nama_kelas: string;
    createdAt: Date;
    updatedAt: Date;
}

const Mapel: FC<Mapel> = () => {

    const { data: mapel, error } = useSWR<Mapel[]>('/api/mapel', fetcher, {});

    const [selectedMapel, setSelectedMapel] = useState<Mapel | null>(null);

    useEffect(() => {
        if (error) {

        }
    }, [error]);

    const onClose = () => {
        setSelectedMapel(null);
    };

    if (error) {
        return <p>Error loading mapel.</p>;
    }



    return (
        <div>
            <h1 className="font-bold text-4xl my-10">List Mapel</h1>

            {
                mapel ? (
                    <>
                        {mapel.length === 0 ? (
                            <p>No mapel found.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nama Mapel</th>
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
                                            <td>{item.kelas?.nama_kelas}</td>
                                            <td>{item.createdAt.toString()}</td>
                                            <td>{item.updatedAt.toString()}</td>
                                            <td>
                                                <button
                                                    onClick={() => setSelectedMapel(item)}
                                                    className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
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
                selectedMapel && (
                    <ModalDetail
                        onOpen={true}
                        onClose={onClose}
                    >
                        <MapelEdit
                            data={selectedMapel}
                            onClose={onClose}
                            mapelId={selectedMapel.id}
                        />
                    </ModalDetail>
                )
            }
        </div>
    )
}

export default Mapel
